package com.librahub.library.service;

import com.librahub.library.exception.ResourceNotFoundException;
import com.librahub.library.model.Member;
import com.librahub.library.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public List<Member> getAll() { return memberRepository.findAll(); }

    public Member getById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found: " + id));
    }

    public Member create(Member m) {
        if (m.getMembershipDate() == null) m.setMembershipDate(LocalDate.now());
        if (m.getStatus() == null) m.setStatus(Member.Status.ACTIVE);
        return memberRepository.save(m);
    }

    public Member update(Long id, Member d) {
        Member m = getById(id);
        m.setName(d.getName()); m.setEmail(d.getEmail()); m.setPhone(d.getPhone());
        m.setAddress(d.getAddress()); m.setStatus(d.getStatus());
        return memberRepository.save(m);
    }

    public void delete(Long id) { getById(id); memberRepository.deleteById(id); }

    public long count() { return memberRepository.count(); }

    public List<Member> search(String name) { return memberRepository.findByNameContainingIgnoreCase(name); }
}
