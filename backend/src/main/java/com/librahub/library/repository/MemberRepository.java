package com.librahub.library.repository;

import com.librahub.library.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByUsername(String username);
    List<Member> findByNameContainingIgnoreCase(String name);
}
