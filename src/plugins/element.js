import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Col,
  Row,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'
Vue.use(Button).use(Form).use(FormItem)
Vue.use(Input).use(Container).use(Header)
Vue.use(Main).use(Menu).use(Aside)
Vue.use(Submenu).use(MenuItem).use(BreadcrumbItem)
Vue.use(Breadcrumb).use(Card).use(Col)
Vue.use(Row).use(Table).use(TableColumn)
Vue.use(Switch).use(Tooltip).use(Pagination).use(Dialog)
Vue.use(Tag).use(Tree).use(Select).use(Option)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm