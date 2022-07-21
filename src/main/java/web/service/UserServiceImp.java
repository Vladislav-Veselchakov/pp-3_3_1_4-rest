package web.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.dao.UserDao;
import web.model.Role;
import web.model.User;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImp implements UserService {

    private UserDao userDao;

    public UserServiceImp(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    @Transactional
    public void add(User user) {
        userDao.add(user);
    }

    @Override
    @Transactional
    public void update(User user) {
        userDao.update(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getUsers() {
        return userDao.getUsers();
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userDao.deleteUser(id);
    }

    @Override
    @Transactional
    public User getUserById(Long id) {
        return userDao.getUserById(id);
    }

    @Transactional
    public Set<Role> getRoles(Long id) {
        return userDao.getRoles(id);
    }

    @Override
    public void setModified(User user, Date modified) {
        userDao.setModified(user, modified);
    }

    @Override
    public void setCreated(User user, Date created) {
        userDao.setCreated(user, created);
    }

    @Override
    public void setRoleByName(User user, String roleName) {
        userDao.setRoleByName(user, roleName);
    }

    @Override
    public void setRoles(User user, Set<Role> roles) {
        userDao.setRoles(user, roles);
    }



}
