package web.dao;

import web.model.Role;
import web.model.User;

import java.util.Date;
import java.util.List;
import java.util.Set;

public interface UserDao {
    void add(User user);
    List<User> getUsers();
    User getUserById(Long id);
    User getUserByName(String name);
    void deleteUser(Long id);
    void update(User user);
    Set<Role> getRoles(Long id);
    void setModified(User user, Date modified);
    void setCreated(User user, Date created);
    void setRoleByName(User user, String roleName);
    void setRoles(User user, Set<Role> roles);
}
