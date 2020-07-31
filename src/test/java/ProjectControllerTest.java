import com.scsme.dataConfigCenter.ConfigCenterApplication;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.annotation.SecurityTestExecutionListeners;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ConfigCenterApplication.class, webEnvironment = SpringBootTest.WebEnvironment.MOCK)
//@SecurityTestExecutionListeners
//@AutoConfigureMockMvc

@WithMockUser(username="admin",roles={"USER","ADMIN"})
public class ProjectControllerTest {
    private static final Logger log = LoggerFactory.getLogger(ProjectControllerTest.class);
    @Autowired
    private WebApplicationContext context;
    //@Autowired
    private MockMvc mockMvc;
    @Before
    public void testBefore(){
        log.info("测试前");

        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @After
    public void testAfter(){
        log.info("测试后");
    }


    @org.junit.Test
    public void getProjects() {
        MvcResult mvcResult= null;
        try {
            mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/projects")).
                    andExpect(MockMvcResultMatchers.status().isOk()).andReturn();

            int status=mvcResult.getResponse().getStatus();
            //打印出状态码，200就是成功
            log.info("状态码="+status);
            Assert.assertEquals(200,status);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @org.junit.Test
    public void getRolesOfProject() {
    }

    @org.junit.Test
    public void getRoleOfProject() {
    }

    @org.junit.Test
    public void getProjectInfo() {
    }

    @org.junit.Test
    public void getAdmins() {
    }

    @org.junit.Test
    public void searchProjects() {
    }

    @org.junit.Test
    public void createProject() {
    }

    @org.junit.Test
    public void deleteProject() {
    }

    @org.junit.Test
    public void updateProjectBaseInfo() {
    }

    @org.junit.Test
    public void favoriteProject() {
    }

    @org.junit.Test
    public void getFavoriteProjects() {
    }

    @org.junit.Test
    public void removeFavoriteProjects() {
    }

    @org.junit.Test
    public void addProjectAdmin() {
    }

    @org.junit.Test
    public void removeProjectAdmin() {
    }

    @org.junit.Test
    public void addRoles() {
    }
}
