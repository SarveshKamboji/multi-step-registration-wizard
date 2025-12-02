<%@ page import="java.sql.*,java.io.*,java.nio.file.*" %>
<%@ page import="javax.servlet.*,javax.servlet.http.*" %>
<%@ page contentType="text/plain;charset=UTF-8" %>

<%
    request.setCharacterEncoding("UTF-8");

    String dbURL = "jdbc:mysql://localhost:3306/registrationdb1";
    String dbUser = "root";
    String dbPass = "";

    String firstName = request.getParameter("firstName");
    String lastName = request.getParameter("lastName");
    String email = request.getParameter("email");
    String phone = request.getParameter("phone");
    String country = request.getParameter("country");
    String dob = request.getParameter("dob");
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    String securityQuestion = request.getParameter("securityQuestion");
    String securityAnswer = request.getParameter("securityAnswer");
    String bio = request.getParameter("bio");

    try {
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(dbURL, dbUser, dbPass);

            String sql = "INSERT INTO users " +
                         "(firstName,lastName,email,phone,country,dob," +
                         " username,password,securityQuestion,securityAnswer," +
                         " bio) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

            ps = conn.prepareStatement(sql);
            ps.setString(1, firstName);
            ps.setString(2, lastName);
            ps.setString(3, email);
            ps.setString(4, phone);
            ps.setString(5, country);
            ps.setString(6, dob);
            ps.setString(7, username);
            ps.setString(8, password);
            ps.setString(9, securityQuestion);
            ps.setString(10, securityAnswer);
            ps.setString(11, bio);

            int result = ps.executeUpdate();
            if (result > 0) {
                response.setStatus(200);
                out.print("OK");
            } else {
                response.setStatus(500);
                out.print("Database Insert Failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("DB ERROR: " + e.getMessage());
        } finally {
            if (ps != null) try { ps.close(); } catch (Exception ignore) {}
            if (conn != null) try { conn.close(); } catch (Exception ignore) {}
        }
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(500);
        out.print("ERROR: " + e.getMessage());
    }
%>
