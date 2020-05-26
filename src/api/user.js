import { axiosA, axiosD, axiosG, axiosM } from "@/api/request";

const addUser = "admin/user/addUser"; // 新增用户
const deleteUser = "admin/user/delUser"; // 删除用户
const editUser = "admin/user/editUser"; // 编辑用户
const getUserList = "admin/user/pageUser"; // 获得用户列表
const getUserLevel = "admin/user/getUserLevel"; // 获得角色级别

export const addUserApi = data => axiosA(addUser, data);
export const deleteUserApi = data => axiosD(deleteUser, data);
export const editUserApi = data => axiosM(editUser, data);
export const getUserListApi = data => axiosG(getUserList, data);
export const getUserLevelApi = () => axiosG(getUserLevel);
