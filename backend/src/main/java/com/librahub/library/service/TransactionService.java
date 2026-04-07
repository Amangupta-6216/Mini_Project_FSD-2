package com.librahub.library.service;

import com.librahub.library.exception.ResourceNotFoundException;
import com.librahub.library.model.*;
import com.librahub.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final double FINE_PER_DAY = 5.0;
    private static final int LOAN_DAYS = 14;

    private final TransactionRepository txRepo;
    private final BookRepository bookRepo;
    private final MemberRepository memberRepo;

    public List<Transaction> getAll() { return txRepo.findAll(); }

    public List<Transaction> getVisibleTransactions(String username, boolean admin) {
        if (admin) return txRepo.findAll();
        Member member = resolveMember(username);
        return txRepo.findByMemberId(member.getId());
    }

    public Transaction issue(Long bookId, Long memberId) {
        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        Member member = memberRepo.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (book.getAvailableCopies() <= 0)
            throw new RuntimeException("No available copies for: " + book.getTitle());

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepo.save(book);

        Transaction t = new Transaction();
        t.setBook(book); t.setMember(member);
        t.setIssueDate(LocalDate.now());
        t.setDueDate(LocalDate.now().plusDays(LOAN_DAYS));
        t.setStatus(Transaction.Status.ISSUED);
        t.setFine(0.0);
        return txRepo.save(t);
    }

    public Transaction issueForMember(String username, Long bookId) {
        return issue(bookId, resolveMember(username).getId());
    }

    public Transaction returnBook(Long txId) {
        Transaction t = txRepo.findById(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        return returnBook(t);
    }

    public Transaction returnBookForMember(String username, Long txId) {
        Member member = resolveMember(username);
        Transaction t = txRepo.findById(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!t.getMember().getId().equals(member.getId()))
            throw new RuntimeException("You can only return your own borrowed books");
        return returnBook(t);
    }

    private Transaction returnBook(Transaction t) {
        if (t.getStatus() == Transaction.Status.RETURNED)
            throw new RuntimeException("Book already returned");

        t.setReturnDate(LocalDate.now());
        t.setStatus(Transaction.Status.RETURNED);
        if (LocalDate.now().isAfter(t.getDueDate())) {
            long days = ChronoUnit.DAYS.between(t.getDueDate(), LocalDate.now());
            t.setFine(days * FINE_PER_DAY);
        }
        Book book = t.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepo.save(book);
        return txRepo.save(t);
    }

    public List<Transaction> getOverdue() {
        refreshOverdueStatus();
        return txRepo.findByStatus(Transaction.Status.OVERDUE);
    }

    public List<Transaction> getVisibleOverdue(String username, boolean admin) {
        refreshOverdueStatus();
        if (admin) return txRepo.findByStatus(Transaction.Status.OVERDUE);
        Member member = resolveMember(username);
        return txRepo.findByMemberId(member.getId()).stream()
                .filter(t -> t.getStatus() == Transaction.Status.OVERDUE)
                .toList();
    }

    public List<Transaction> getByMember(Long memberId) { return txRepo.findByMemberId(memberId); }

    public long issuedCount() { return txRepo.countByStatus(Transaction.Status.ISSUED); }
    public long overdueCount() { return txRepo.countByStatus(Transaction.Status.OVERDUE); }

    private void refreshOverdueStatus() {
        txRepo.findByStatus(Transaction.Status.ISSUED).forEach(t -> {
            if (t.getDueDate().isBefore(LocalDate.now())) {
                long days = ChronoUnit.DAYS.between(t.getDueDate(), LocalDate.now());
                t.setStatus(Transaction.Status.OVERDUE);
                t.setFine(days * FINE_PER_DAY);
                txRepo.save(t);
            }
        });
    }

    private Member resolveMember(String username) {
        return memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found for user: " + username));
    }
}
