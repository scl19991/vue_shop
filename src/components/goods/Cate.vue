<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" class="addRole"
          @click="showAddCateDialog"
          >添加分类</el-button>
        </el-col>
    </el-row>

    <!-- 表格 -->
    <tree-table :data="cateList" class="treeTable" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
      <!-- 模板：是否有效 -->
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="!scope.row.cat_deleted"
        style="color: green;"></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
        <!-- 模板：排序 -->
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level === 1" 
        type="success" size="mini">二级</el-tag>
        <el-tag v-else type="warning" size="mini">三级</el-tag>
      </template>
      <!-- 模板：操作 -->
      <template slot="opt" slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="searchEditCate(scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete"
        @click="searchDeleteCate(scope.row)">删除</el-button>
      </template>
    </tree-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <!-- 表单部分 -->
      <el-form :model="addcateForm" :rules="addcateFormRules" ref="addcateFormRef" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addcateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- options用来指定数据源 props用来指定配置对象-->
        <el-cascader  
          expandTrigger="hover"
          :options="parentCateList"
          :props="CascaderProps"
          v-model="selectedKeys"
          @change="parentCateChanged"
          clearable>
        </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 按钮部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
  title="编辑分类"
  :visible.sync="editCatedialogVisible"
  width="50%"
  @close="editCatedialogClosed">
  <el-form :model="editCateForm" :rules="editCateRules" ref="editCateRef" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  name:'Cate',
  data () {
    return {
      //商品分类的数据列表
      cateList: [],
      //父级分类的数据列表
      parentCateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //控制编辑分类对话框的显示与隐藏
      editCatedialogVisible: false,
      //为table指定列的定义
      columns: [{
        label:'分类名称',
        prop:'cat_name'
      },{
        label:'是否有效',
        //表示，将当前列 定义为模板列
        type:'template',
        //表示当前这列使用的模板名称
        template:'isok'
      },{
        label:'排序',
        //表示，将当前列 定义为模板列
        type:'template',
        //表示当前这列使用的模板名称
        template:'order'
      },{
        label:'操作',
        //表示，将当前列 定义为模板列
        type:'template',
        //表示当前这列使用的模板名称
        template:'opt'
      }],
      //添加分类的表单数据对象
      addcateForm:{
        //将要添加分类的父Id
        cat_pid: 0,
        // 将要添加的分类的名称
        cat_name:'',
        // 将要添加的分类的等级
        cat_level: 0
      },
      //添加分类的表单数据规则
      addcateFormRules:{
        cat_name:[{required:true, message:'请输入分类名称', trigger:'blur'}]
      },
      //指定级联选择器的配置对象
      CascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly: true  
      },
      //修改分类的表单数据对象
      editCateForm:{
        cat_name:''
      },
      //修改分类的表单数据规则
      editCateRules:{
        cat_name:[{required:true, message:'请输入分类名称', trigger:'blur'}]
      },
      //暂存修改分类的id值
      editCateId: 0,
      //选中的父级分类id数组
      selectedKeys: []
    }
  },
  created () {
    this.getCartList()
  },
  methods: {
    //获取商品分类数据
    async getCartList(){
      const{data: res} = await this.$http.get('categories',{params: this.queryInfo})
      if(res.meta.status != 200){
        return this.$message.error('获取商品分类失败！')
      }
      //赋值数据列表
      this.cateList = res.data.result
      //赋值总的数据条数
      this.total = res.data.total
    },
    //监听 pagesize改变的情况
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCartList()
    },
    //监听 页码值的改变情况
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getCartList()
    },
    //点击展开添加分类对话框
    showAddCateDialog(){
      //先获取父级分类的数据列表 再展示对话框
      this.getParentCateList()
      this.addCateDialogVisible = true      
    },
    //获取父级分类的数据列表
    async getParentCateList(){
      const{data: res} = await this.$http.get('categories',{params:{type: 2}})
      if(res.meta.status != 200){
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList);
    },
    //选择项发生变化触发
    parentCateChanged(){
      if(this.selectedKeys.length >0){
        this.addcateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addcateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addcateForm.cat_pid = 0
        this.addcateForm.cat_level = 0
      }
    },
    //点击按钮添加新的分类
    addCate(){
      this.$refs.addcateFormRef.validate(async valid =>{
      if(!valid) return 
        const {data: res} = await this.$http.post('categories',this.addcateForm)
        if(res.meta.status != 201){
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCartList()
        this.addCateDialogVisible = false
      })
    },
    //监听添加分类对话框的关闭事件，重置对话框
    addCateDialogClosed(){
      this.$refs.addcateFormRef.resetFields()
      //重置级联选择器
      this.addcateForm.cat_pid = 0
      this.addcateForm.cat_level = 0
      this.selectedKeys = []
    },
    //监听编辑按钮的点击
    searchEditCate(cate){
      this.editCateForm.cat_name = cate.cat_name
      this.editCatedialogVisible = true
      this.editCateId = cate.cat_id
    },
    //提交编辑分类
    editCate(){
      this.$refs.editCateRef.validate(async valid =>{
        if(!valid) return 
        const {data: res} = await this.$http.put(`categories/${this.editCateId}`,{cat_name: this.editCateForm.cat_name})
        console.log(res);
        if(res.meta.status != 200){
          return this.$message.error('编辑分类失败！')
        }
        this.$message.success('编辑分类成功！')
        this.getCartList()
        this.editCatedialogVisible = false
      })
    },
    //监听编辑对话框的关闭
    editCatedialogClosed(){
      this.$refs.editCateRef.resetFields()
    },
    //监听删除按钮的点击
    searchDeleteCate(cate){
      this.deleteCateById(cate.cat_id)
      
    },
    //删除分类
    async deleteCateById(id){
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
        const{data: res} = await this.$http.delete(`categories/${id}`)
        if(res.meta.status == 200){
          this.$message({type: 'success',message: '删除成功!'});
          this.queryInfo.pagenum = 1
          this.getCartList()
        }else{
          this.$message({type: 'error',message: '删除失败,网络错误!'});
        }
      }
    }

  }
}
</script>

<style scoped>
.treeTable{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
