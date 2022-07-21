package web.dao;

import web.model.Role;
import web.model.User;

import java.util.List;
import java.util.Set;

public interface RoleDao {
    void add(Role role);
    void update(Role role);
    List<Role> getRoles();
    List<Role> getRolesWithCheck(User user);
    Set<Role> getRolesByIdList(List<Long> id);
    void deleteRole(Long id);
    Role getRoleById(Long id);
}
