package com.librahub.library.config;

import com.librahub.library.model.*;
import com.librahub.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final BookRepository bookRepo;
    private final MemberRepository memberRepo;
    private final TransactionRepository txRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            ensureMemberUserLink();
            return;
        }

        // --- Users ---
        userRepo.save(makeUser("admin", "admin123", User.Role.ADMIN));
        userRepo.save(makeUser("member", "member123", User.Role.MEMBER));

        // --- Books ---
        List<Book> books = bookRepo.saveAll(List.of(
            book("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565", "Fiction", "Scribner", 1925, 3, "A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan."),
            book("To Kill a Mockingbird", "Harper Lee", "978-0061120084", "Fiction", "HarperCollins", 1960, 4, "A powerful story of racial injustice and childhood innocence in the American South."),
            book("1984", "George Orwell", "978-0452284234", "Dystopia", "Signet Classic", 1949, 5, "A dystopian novel about totalitarianism and Big Brother's surveillance state."),
            book("Brave New World", "Aldous Huxley", "978-0060850524", "Dystopia", "HarperCollins", 1932, 3, "A futuristic society where technology and conditioning control human lives."),
            book("The Alchemist", "Paulo Coelho", "978-0062315007", "Fiction", "HarperOne", 1988, 6, "A philosophical novel about following your dreams and personal destiny."),
            book("Clean Code", "Robert C. Martin", "978-0132350884", "Technology", "Prentice Hall", 2008, 4, "A handbook of agile software craftsmanship and coding best practices."),
            book("Design Patterns", "Gang of Four", "978-0201633610", "Technology", "Addison-Wesley", 1994, 3, "Classic book on software design patterns for reusable object-oriented software."),
            book("The Pragmatic Programmer", "David Thomas", "978-0135957059", "Technology", "Addison-Wesley", 2019, 4, "A timeless guide to becoming a better software developer."),
            book("Sapiens", "Yuval Noah Harari", "978-0062316097", "History", "Harper", 2011, 5, "A brief history of humankind from the Stone Age to the 21st century."),
            book("A Brief History of Time", "Stephen Hawking", "978-0553053401", "Science", "Bantam Books", 1988, 3, "An exploration of cosmology, space, time, and the universe."),
            book("Thinking Fast and Slow", "Daniel Kahneman", "978-0374533557", "Science", "Farrar Straus", 2011, 3, "Explores the two systems that drive the way we think and make decisions."),
            book("The Lean Startup", "Eric Ries", "978-0307887917", "Technology", "Crown Business", 2011, 3, "How entrepreneurs use continuous innovation to create successful businesses."),
            book("Harry Potter - Philosophers Stone", "J.K. Rowling", "978-0747472988", "Fiction", "Bloomsbury", 1997, 7, "The first book in the magical Harry Potter series."),
            book("Hitchhikers Guide to the Galaxy", "Douglas Adams", "978-0345391803", "Sci-Fi", "Pan Books", 1979, 4, "A comedic sci-fi series following Arthur Dent's misadventures across the universe."),
            book("Introduction to Algorithms", "Thomas H. Cormen", "978-0262046305", "Technology", "MIT Press", 2009, 2, "Comprehensive reference on algorithms and data structures."),
            book("Atomic Habits", "James Clear", "978-0735211292", "Self-Help", "Avery", 2018, 5, "A guide to building good habits and breaking bad ones through tiny changes."),
            book("Rich Dad Poor Dad", "Robert Kiyosaki", "978-1612680194", "Finance", "Plata Publishing", 1997, 4, "What the rich teach their kids about money that the poor do not."),
            book("The Art of War", "Sun Tzu", "978-1590305539", "History", "Shambhala", 500, 4, "Ancient Chinese military treatise on strategy, tactics and philosophy."),
            book("Origin of Species", "Charles Darwin", "978-0140432053", "Science", "Penguin Classics", 1859, 3, "Darwin's groundbreaking theory of evolution by natural selection."),
            book("The Power of Now", "Eckhart Tolle", "978-1577314806", "Self-Help", "New World Library", 1997, 3, "A guide to spiritual enlightenment and living in the present moment.")
        ));

        // --- Members ---
        List<Member> members = memberRepo.saveAll(List.of(
            member("Rahul Sharma", "rahul.sharma@email.com", "9876543210", "123 Main St, Mumbai", LocalDate.of(2024, 1, 15), "member"),
            member("Priya Patel", "priya.patel@email.com", "9876543211", "456 Park Ave, Delhi", LocalDate.of(2024, 2, 20)),
            member("Arjun Singh", "arjun.singh@email.com", "9876543212", "789 Oak Rd, Bangalore", LocalDate.of(2024, 3, 10)),
            member("Neha Gupta", "neha.gupta@email.com", "9876543213", "321 Lake View, Chennai", LocalDate.of(2024, 1, 5)),
            member("Vikram Mehta", "vikram.mehta@email.com", "9876543214", "654 Hill Top, Pune", LocalDate.of(2024, 4, 1)),
            member("Sneha Reddy", "sneha.reddy@email.com", "9876543215", "987 River Rd, Hyderabad", LocalDate.of(2024, 2, 14)),
            member("Amit Kumar", "amit.kumar@email.com", "9876543216", "147 Garden St, Kolkata", LocalDate.of(2024, 3, 22)),
            member("Kavya Nair", "kavya.nair@email.com", "9876543217", "258 Beach Rd, Kochi", LocalDate.of(2024, 1, 30)),
            member("Rajan Verma", "rajan.verma@email.com", "9876543218", "369 Forest Lane, Jaipur", LocalDate.of(2024, 4, 5)),
            member("Isha Joshi", "isha.joshi@email.com", "9876543219", "741 Cloud Ave, Ahmedabad", LocalDate.of(2024, 2, 8))
        ));

        // --- Transactions (Active) ---
        tx(books.get(0), members.get(0), LocalDate.now().minusDays(5), LocalDate.now().plusDays(9), null, Transaction.Status.ISSUED, 0.0);
        tx(books.get(2), members.get(1), LocalDate.now().minusDays(3), LocalDate.now().plusDays(11), null, Transaction.Status.ISSUED, 0.0);
        tx(books.get(5), members.get(2), LocalDate.now().minusDays(7), LocalDate.now().plusDays(7), null, Transaction.Status.ISSUED, 0.0);
        // Overdue
        tx(books.get(1), members.get(3), LocalDate.now().minusDays(20), LocalDate.now().minusDays(6), null, Transaction.Status.OVERDUE, 30.0);
        tx(books.get(8), members.get(4), LocalDate.now().minusDays(18), LocalDate.now().minusDays(4), null, Transaction.Status.OVERDUE, 20.0);
        // Returned
        tx(books.get(3), members.get(5), LocalDate.now().minusDays(15), LocalDate.now().minusDays(1), LocalDate.now().minusDays(2), Transaction.Status.RETURNED, 0.0);
        tx(books.get(6), members.get(6), LocalDate.now().minusDays(12), LocalDate.now().plusDays(2), LocalDate.now().minusDays(1), Transaction.Status.RETURNED, 0.0);

        // Adjust available copies for issued/overdue
        // Already set at full copies; manually reduce
        books.get(0).setAvailableCopies(books.get(0).getAvailableCopies() - 1);
        books.get(2).setAvailableCopies(books.get(2).getAvailableCopies() - 1);
        books.get(5).setAvailableCopies(books.get(5).getAvailableCopies() - 1);
        books.get(1).setAvailableCopies(books.get(1).getAvailableCopies() - 1);
        books.get(8).setAvailableCopies(books.get(8).getAvailableCopies() - 1);
        bookRepo.saveAll(books);
    }

    private void ensureMemberUserLink() {
        userRepo.findByUsername("member").ifPresent(user -> {
            if (memberRepo.findByUsername(user.getUsername()).isPresent()) return;

            memberRepo.findAll().stream().findFirst().ifPresentOrElse(member -> {
                member.setUsername(user.getUsername());
                memberRepo.save(member);
            }, () -> memberRepo.save(member(
                    "Library Member",
                    "member@librahub.local",
                    "",
                    "",
                    LocalDate.now(),
                    user.getUsername()
            )));
        });
    }

    private User makeUser(String username, String password, User.Role role) {
        User u = new User(); u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password)); u.setRole(role); return u;
    }

    private Book book(String title, String author, String isbn, String genre, String publisher, int year, int copies, String desc) {
        Book b = new Book(); b.setTitle(title); b.setAuthor(author); b.setIsbn(isbn);
        b.setGenre(genre); b.setPublisher(publisher); b.setPublishYear(year);
        b.setTotalCopies(copies); b.setAvailableCopies(copies); b.setDescription(desc); return b;
    }

    private Member member(String name, String email, String phone, String address, LocalDate date) {
        return member(name, email, phone, address, date, null);
    }

    private Member member(String name, String email, String phone, String address, LocalDate date, String username) {
        Member m = new Member(); m.setName(name); m.setEmail(email); m.setPhone(phone);
        m.setAddress(address); m.setMembershipDate(date); m.setStatus(Member.Status.ACTIVE); m.setUsername(username); return m;
    }

    private void tx(Book book, Member member, LocalDate issue, LocalDate due, LocalDate ret, Transaction.Status status, double fine) {
        Transaction t = new Transaction(); t.setBook(book); t.setMember(member);
        t.setIssueDate(issue); t.setDueDate(due); t.setReturnDate(ret);
        t.setStatus(status); t.setFine(fine); txRepo.save(t);
    }
}
