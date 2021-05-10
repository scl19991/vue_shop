<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      :closable="false"
      show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 选择商品的级联选择框 -->
          <el-cascader  
          expandTrigger="hover"
          :options="cateList"
          :props="CascaderProps"
          v-model="selectedKeys"
          @change="handleChanged" 
          clearable>
        </el-cascader>
        <!-- -->
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="mini" :disabled="isShow"
          @click="addDialogVisible = true" class="btn">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 动态参数展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" 
                :key="index" closable
                @close="handleClose(scope.row,index)">
                  {{item}}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                @click="deleteAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button type="primary" size="mini" :disabled="isShow"
          @click="addDialogVisible = true" class="btn">添加参数</el-button>
            <!-- 静态属性表格 -->
            <el-table :data="onlyTableData" border stripe width="100%">
               <!--静态属性展开行  -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" 
                :key="index" closable
                @close="handleClose(scope.row,index)">
                  {{item}}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                @click="deleteAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
<el-dialog
  :title="'添加' + titleText"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">
  <!-- 表单 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFormCommit">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改参数的对话框 -->
<el-dialog
  :title="'修改' + titleText"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed">
  <!-- 表单 -->
  <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormCommit">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name:'Params',
  data(){
   return {
     //商品分类列表
     cateList: [],
     //级联选择器的规则
     CascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //级联选择框双向绑定到的数组
      selectedKeys: [],
      //被激活的页签的名称(默认first)
      activeName: 'many',
      //用于存放获取来的动态参数
      manyTableData: [],
      //用于存放获取来的静态属性
      onlyTableData: [],
      //添加参数对话框的显示和隐藏
      addDialogVisible: false,
      //编辑参数对话框的显示和隐藏
      editDialogVisible: false,
      //控制动态编辑标签
      inputVisible:false,
      //文本框中输入的内容
      inputValue: '',
      //添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      //编辑参数的表单数据对象
      editForm:{
        attr_name: '',
        attr_id: 0,
        cat_id: 0
      },
      //添加表单的验证规则对象
      addFormRules:{
        attr_name:[{
          required:true, message:'请输入参数名称', trigger:'blur'
        }]
      }
    }
  },
  computed: {
    isShow(){
      if(this.selectedKeys.length !== 3){
        return true
      }
      return false
    },
    //当前选中的三级分类的id
    cateId(){
      if(this.selectedKeys.length === 3){
        return this.selectedKeys[2]
      }
      return null
    },
    //计算当前对话框标题
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created () {
    // 获取所有的商品分类列表
    this.getCateList()
  },
  methods: {
    async getCateList(){
      const{data:res} = await this.$http.get('categories')
      if(res.meta.status != 200){
        return this.$message.error('获取商品分类失败!')
      }
      this.cateList = res.data
    },
    //级联选择框选中项变化,会触发的函数
    handleChanged(){
      this.getParamsData()
    },
    //Tab页签点击事件的处理函数
    handleTabClick(){
      this.getParamsData()
    },
    //获取参数的列表数据
    async getParamsData(){
      if(this.selectedKeys.length != 3){
        //选中的不是三级分类
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return 
      }
      //发起请求 获取动态静态属性
      const{data: res} = await this.$http.get(`categories/
      ${this.cateId}/attributes`,{params: {sel : this.activeName}})

      if(res.meta.status != 200){
        return this.$message.error('获取参数列表失败!')
      }
      res.data.forEach(item => {
        //判断是否为空
        item.attr_vals = item.attr_vals ?
        item.attr_vals.split(',') : []
        //控制文本框的显示和隐藏
        item.inputVisible = false
        //文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data);
      if(this.activeName === 'many'){
        this.manyTableData = res.data
      }
      this.onlyTableData = res.data
    },
    //取消时重置表单
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //提交创建参数的表单
    addFormCommit(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return 
        const {data: res} = await this.$http.post(`categories/
        ${this.cateId}/attributes`,
        {attr_name: this.addForm.attr_name,attr_sel: this.activeName})
        if(res.meta.status != 201){
          return this.$message.error('创建参数失败!') 
        }
        this.$message.success('创建参数成功!') 
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    //显示编辑属性/参数的对话框
    async showEditDialog(attr){
      this.editDialogVisible = true
      console.log(attr);
      const{data: res} =await this.$http.get(`categories/${attr.cat_id}/attributes/${attr.attr_id}`)
      if(res.meta.status != 200){
        return this.$message.error('获取参数信息失败!')
      }
      this.editForm.attr_name = res.data.attr_name
      this.editForm.attr_id = res.data.attr_id
      this.editForm.cat_id = res.data.cat_id
    },
    //监听关闭编辑属性对话框
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //提交编辑参数的表单
    editFormCommit(){
      console.log(this.editForm);
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return 
        const{data: res} = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,{
          attr_sel: this.activeName,
          attr_name: this.editForm.attr_name}
        )
        console.log(res);
        if(res.meta.status != 200){
          return this.$message.error('编辑参数信息失败!')
        }
        this.$message.success('编辑参数信息成功!')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    //监听删除属性事件
    async deleteAttr(attr){
      console.log(attr);
      const confirmResult = await this.$confirm(
      '此操作将永久删除该参数, 是否继续?', 
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
        const{data: res} = await this.$http.delete(`categories/${attr.cat_id}/attributes/${attr.attr_id}`)
        if(res.meta.status == 200){
          this.$message({type: 'success',message: '删除成功!'});
          this.getParamsData()
        }else{
          this.$message({type: 'error',message: '删除失败,网络错误!'});
        }
      }
    },
    //文本框失去焦点,或者按下回车触发
    async handleInputConfirm(row){
      //判断输入是否合法
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return 
      }
      //把数据添加到展示数组之中 然后再清空
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      console.log(row);
      //发起数据请求 保存数据
      this.saveAttrVals(row)
    },
    //点击New Tag显示文本框
    showInput(row){
      row.inputVisible = true
      //让文本框自动获得焦点
      //$nextTick 方法: 当页面上元素被重新渲染之后,才会指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //将对 attr_vals 的操作 保存到数据库中
    async saveAttrVals(row){
      const{data: res} = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if(res.meta.status != 200){
        return this.$message.error('修改参数项失败!')
      }
      return this.$message.success('修改参数项成功!')
    },
    //监听参数项的删除
    handleClose(row,index){
      row.attr_vals.splice(index , 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style scoped>
.cat_opt, .btn {
  margin: 15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 150px;
}
</style>
