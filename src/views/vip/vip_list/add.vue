<template>
  <el-dialog
    title="新增会员"
    width="500px"
    @close="cancel"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="会员账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="会员昵称" prop="nickName">
        <el-input v-model="form.nickName"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="SubmitButton" @submit="submitForm" />
    </div>
  </el-dialog>
</template>

<script>
import { addUserApi } from "@/api/user";
import { validatePhone, validateUsername } from "@/utils/validate";

export default {
  name: "AddVip",
  data() {
    return {
      normalizer(node) {
        return {
          label: node.name
        };
      },
      visible: false,
      form: {
        username: "",
        nickName: "",
        number: "",
        sex: "男",
        phone: "",
        enabled: true,
        rolesId: [3]
      },
      options: [],
      rules: {
        username: [
          { required: true, message: "请输入会员账号", trigger: "blur" },
          { validator: validateUsername, trigger: "blur" }
        ],
        nickName: {
          required: true,
          message: "请输入会员昵称",
          trigger: "blur"
        },
        phone: [
          { required: true, message: "请输入会员电话", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs["Form"].validate(valid => {
        if (valid) {
          let data = { ...this.form };
          this.$refs.SubmitButton.start();
          addUserApi(data)
            .then(() => {
              this.$refs.SubmitButton.stop();
              this.$emit("update");
              this.cancel();
            })
            .catch(() => {
              this.$refs.SubmitButton.stop();
            });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.visible = false;
      Object.assign(this.$data.form, this.$options.data().form);
      this.$refs["Form"].resetFields();
    }
  }
};
</script>
