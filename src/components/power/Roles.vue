<template>
<div>
  <!-- 面包屑 头部导航 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" class="addRole"
        @click="addRoleVisible = true"
        >添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表区域 -->
  <el-table :data="roleList" border stripe >
    <!-- 展开列 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row :class="['bdbottom',index === 0 ? 'bdtop':'','vcenter']"   v-for="(item1,index) in scope.row.children" :key="item1.id">
          <!-- 渲染一级权限 -->
          <el-col :span="5">
            <el-tag  closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 渲染二级和三级权限 -->
          <el-col :span="19">
            <el-row :class="[indey === 0 ? '':'bdtop','vcenter']"
            v-for="(item2,indey) in item1.children" :key="item2.id">
            <!-- 渲染二级权限 -->
              <el-col :span="6">
                <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                <i class="el-icon-caret-right"></i> 
              </el-col>
              <el-col :span="18">
                 <!-- 渲染三级权限 -->
                <el-tag type="warning" v-for="(item3) in item2.children" 
                :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作" width="300px">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit"
        @click="searchRoleById(scope.row.id)">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete"
        @click="deleteRoleById(scope.row.id)">删除</el-button>
        <el-button size="mini" type="warning" icon="el-icon-setting"
        @click="showSetRightDialog(scope.row)">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-card>
  <!-- 添加角色的对话框 -->
 <el-dialog
  title="添加角色"
  :visible.sync="addRoleVisible"
  width="50%"
  @close="addRoleClosed">
  <!-- 内容主体区域 -->
  <el-form :model="addRoleObj" :rules="addRoleRules" ref="addRoleRef" label-width="100px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRoleObj.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRoleObj.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
  </el-dialog>
   <!-- 编辑角色的对话框 -->
 <el-dialog
  title="添加角色"
  :visible.sync="editRoleVisible"
  width="50%"
  @close="editRoleClosed">
  <!-- 内容主体区域 -->
  <el-form :model="RoleSearch" :rules="addRoleRules" ref="editRoleRef" label-width="100px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="RoleSearch.roleName"></el-input>
  </el-form-item>

  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="RoleSearch.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 分配权限的对话框 --> 
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%">
  <!-- 树形控件 -->
  <el-tree :data="rightsList" :props="treeProps" show-checkbox
  node-key="id" default-expand-all :default-checked-keys="defKeys"
  ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  name:'Roles',
  data () {
    return {
      //暂存角色id
      roleId:'',
      //角色列表数据
      roleList: [],
      //所有权限数据
      rightsList: [],
      //默认选中的节点id数组 
      defKeys: [],
      addRoleVisible: false,  //控制添加角色对话框的显示和隐藏
      editRoleVisible: false, //编辑角色
      setRightDialogVisible: false, //分配权限
      // 添加用户的模型
      addRoleObj:{
        roleName:'',
        roleDesc:''
      },
      //查找到用户(根据id)的模型
      RoleSearch:{
        roleId:'',
        roleName:'',
        roleDesc:''
      },
      //添加用户的规则
      addRoleRules: {
        roleName:[//与el-form-item 的 prop属性对应
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      //树形控件的属性绑定对象
      treeProps:{
        label: 'authName',
        children: 'children'
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList(){
      const {data: res} = await this.$http.get('roles');
      if(res.meta.status != 200){
        return this.$message.error('获取角色列表失败!');
      }
      this.roleList = res.data
    },
    //添加角色
    async addRole(){
     const {data: res} = await this.$http.post('roles',this.addRoleObj)
     if(res.meta.status != 201){
        return this.$message.error('添加角色失败!');
      }
      this.$message.success('添加角色成功!');
      this.addRoleVisible = false
      this.getRolesList()
    },
    //添加角色栏关闭时重置
    addRoleClosed(){
      this.$refs.addRoleRef.resetFields()
    },
    //根据用户id查找角色信息显示在编辑栏
    async searchRoleById(id){
      const{data: res} = await this.$http.get(`roles/${id}`)
      if(res.meta.status != 200){
        return this.$message.error('获取角色信息失败!');
      }
      this.RoleSearch.roleId = res.data.roleId;
      this.RoleSearch.roleName = res.data.roleName;
      this.RoleSearch.roleDesc = res.data.roleDesc;
      this.editRoleVisible = true
    },
    //监听编辑角色提交
    async editRole(){
      const{data: res} = await this.$http.put(`roles/${this.RoleSearch.roleId}`,this.RoleSearch)
       if(res.meta.status != 200){
        return this.$message.error('角色信息失败!');
      }
      this.$message.success('修改角色信息成功!');
      this.editRoleVisible = false
      this.getRolesList()
    },
    //监听编辑角色栏关闭
    editRoleClosed(){
      this.$refs.editRoleRef.resetFields()
    },
    //监听删除角色按钮
    async deleteRoleById(id){
      const confirmResult = await this.$confirm(
      '此操作将永久删除该角色, 是否继续?', 
      '提示', 
      {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).catch(err=> err);
      //点击确定 返回的是confirm 取消 返回的是cancel
      if(confirmResult === 'cancel'){
        this.$message({type: 'info',message: '已取消删除'});
      }else{
        const{data: res} = await this.$http.delete(`roles/${id}`)
        if(res.meta.status == 200){
          this.$message({type: 'success',message: '删除成功!'});
          this.getRolesList()
        }else{
          this.$message({type: 'error',message: '删除失败,网络错误!'});
        }
      }
    },
    //根据id删除对应的权限
    async removeRightById(role, RightId){
      //弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
      '此操作将永久删除该角色, 是否继续?', 
      '提示', 
      {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).catch(err=> err);
      //点击确定 返回的是confirm 取消 返回的是cancel
      if(confirmResult === 'cancel'){
        this.$message({type: 'info',message: '已取消删除'});
      }else{
        const{data: res} = await this.$http.delete(`roles/${role.id}/rights/${RightId}`)
        if(res.meta.status == 200){
          role.children = res.data
          this.$message({type: 'success',message: '删除成功!'});
        }else{
          this.$message({type: 'error',message: '删除失败,网络错误!'});
        }
      }
    },
    //展示分配权限的对话框
    async showSetRightDialog(role){ 
      //把id保存下来 用于修改后提交用 
      this.roleId = role.id
      const {data: res} = await this.$http.get('rights/tree')
      if(res.meta.status != 200){
        return this.$message.error('获取权限列表失败!')
      }
      //把获取到的数据保存到data中
      this.rightsList = res.data
      //递归获取三级节点Id
      this.defKeys = []
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    //通过递归的形式，获取角色下所有的三级权限id并且保存在defKeys数组中
    getLeafKeys(node, arr){
      //如果当前node节点不包含children属性 则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        return this.getLeafKeys(item, arr)
        })
    },
    //点击为角色分配权限
    async allotRights(){
      //tree的方法调用
      const keys = [...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()]

      const idStr = keys.join(',')
      const {data: res} =await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
      if(res.meta.status != 200){
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
  },
}
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card{
  box-shadow: 0 1px 1px rgba(0, 0, 0, .15) !important; 
}
.addRole{
  margin-bottom: 20px;
}
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
  border-bottom: 1px solid #eee;
}

.vcenter{
  display: flex;
  align-items: center;
}
</style>
