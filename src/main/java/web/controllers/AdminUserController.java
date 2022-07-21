package web.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;
import web.model.Role;
import web.model.User;
import web.service.RoleService;
import web.service.UserService;

import java.net.URI;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminUserController {
    public static int firstYN = 0;

    private final UserService userService;
    private final RoleService roleService;
    public AdminUserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(value = "/addUser")
    public String addPage(ModelMap model) {
        User usr = new User();
        model.addAttribute("user", usr);
        return "addUser";
    }

    @PostMapping(value = "/addUser",  produces = {"application/xml; charset=UTF-8"})
    public String addUser(@RequestBody User user, ModelMap model) {

        userService.setCreated(user, new GregorianCalendar().getTime());
        userService.setModified(user, new GregorianCalendar().getTime());
        Set<Role> roles = user.getRoles();
        user.setRoles(null);
        userService.add(user);
        user.setRoles(roles);
        userService.update(user);
        return "redirect:/admin";
    }

    @GetMapping(value = "/edit")
    public String editPage2(@RequestParam Long id, ModelMap model) {
        User user = userService.getUserById(id);
        List<Role> rolessWCheck = roleService.getRolesWithCheck(user);
        model.addAttribute("user", user);
        model.addAttribute("roles", rolessWCheck);
        return "editUser";
    }

    @PostMapping("editUser")
    public String  editUser2(@RequestBody User user, ModelMap model) {
        userService.update(user);
        int aaa = 111;
//        return "forward:/admin";
        // ни forward ни redirect здесь не имеют значения, так как мы пользовались функцией  await fetch()
        // А эта ф-ция асинхронная, пожэтому redirect я делал в ней (fetch().thex(x=> local.window.href =
        return "redirect:/admin"; // doesn't make any difference, because we use await fetch()
    }
//////////////// delete //////////////////////////////////////
    @DeleteMapping(value = "/delete")
    public String DeleteUser(@RequestParam Long id, RedirectAttributes attr, ModelMap model) {
//        if(firstYN == 0){
//            firstYN++;
//            return "null";
//        }
        userService.deleteUser(id);
        DateFormat df = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
        attr.addFlashAttribute("result001", "User deleted at " + df.format((new GregorianCalendar()).getTime()));
//        return "redirect:/admin";
        return "redirect:/admin";
    }

    @GetMapping("getUserWroles")
//    public ResponseEntity<User> getUserWroles(@RequestParam Long id, ModelMap model) {
    public @ResponseBody User getUserWroles(@RequestParam Long id, ModelMap model) {
        User user = userService.getUserById(id);
        List<Role> rolessWCheck = roleService.getRolesWithCheck(user);
        Set<Role> roles2 = rolessWCheck.stream().collect(Collectors.toSet());
        user.setRoles(roles2);
//        user.setRoles(rolessWCheck.stream().collect(Collectors.toSet()));
//        if (foundStudent == null) {
//            return ResponseEntity.notFound().build();
//        } else {
//            return ResponseEntity.ok(foundStudent);
//        }

        return user;
    }


}
