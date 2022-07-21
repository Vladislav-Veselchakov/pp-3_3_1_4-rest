package web.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import web.model.Role;
import web.model.User;
import web.service.UserService;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/user")
public class UserPageController {
    private UserService userService;

    public UserPageController(UserService service) {
        this.userService = service;
    }

    @GetMapping(value = "")
    public String UserPage(Authentication auth, ModelMap model) {

        User user = (User) auth.getPrincipal();
        StringBuilder sb = new StringBuilder();
        sb.append(user.getEmail()).append(" with roles: ");
        user.getRoles().stream().forEach(role -> {sb.append(role.getName()).append(", ");});
        // убираем запятую и пробел в конце строки с ролями:
        if(sb.length() > 0){
            sb.deleteCharAt(sb.length() - 1);
            sb.deleteCharAt(sb.length() - 1);
        }
        model.addAttribute("userinfo", sb.toString());

//        List<String> messages = new ArrayList<>();
//        messages.add(String.format("Hello user \"%s!\"", user.getFirstName()));
//        messages.add("Your id: " + user.getId());
//        messages.add("First name: " + user.getFirstName());
//        messages.add("Last name: " + user.getLastName());
//        messages.add("E-mail: " + user.getEmail());
//        messages.add("Added/updated: " + user.getModified());
//        messages.add("Roles: " + sb.toString());
        model.addAttribute("user", user);
        model.addAttribute("strRoles", sb.toString());
//        model.addAttribute("messages", messages);
        return "userPage";
    }
}