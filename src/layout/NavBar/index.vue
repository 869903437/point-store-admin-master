<template>
  <div id="nav-bar">
    <el-dropdown trigger="click">
      <div class="el-dropdown-link">
        <el-avatar shape="square" :size="44" :src="avatarUrl">
          <img src="../../assets/notFound.png" alt="头像" />
        </el-avatar>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-s-custom" @click.native="goPerson"
          >个人中心</el-dropdown-item
        >
        <el-dropdown-item
          icon="el-icon-s-promotion"
          divided
          @click.native="logout"
          >退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { logoutApi } from "@/api/person";

export default {
  name: "NavBar",
  data() {
    return {
      drawer: false
    };
  },
  computed: {
    avatarUrl() {
      return process.env.VUE_APP_BASE_API + this.$storeGet.user.avatar;
    }
  },
  methods: {
    // 进入个人中心
    goPerson() {
      this.$storeSet("setBreadcrumb", ["个人中心"]);
      this.$storeSet("addTags", {
        title: "个人中心",
        name: "person",
        indexPath: ["个人中心"]
      });
      this.$storeSet("setActive", "个人中心");
      this.$router.push({ name: "person" });
    },
    // 退出登录
    logout() {
      this.$msgBox("确定注销并退出系统吗？").then(() => {
        logoutApi().then(() => {
          this.$storeSet("quitLogin");
        });
      });
    }
  }
};
</script>

<style lang="scss">
@import "../scss/index";

#nav-bar {
  display: flex;

  .search-menu,
  .screen-full-button {
    padding-right: 15px;
  }

  .el-dropdown-link {
    display: flex;
    justify-items: center;
    margin-top: ($header-height - 44px) /2;
    cursor: pointer;
  }

  .setting {
    .el-drawer__body {
      height: 0;
    }

    .el-drawer {
      width: 350px !important;
    }
  }
}
</style>
