<template>
  <div class="food-list-container">
    <el-card class="filter-card">
      <div class="filter-container">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddFood">添加食物</el-button>
        <el-button type="success" icon="el-icon-upload2" @click="handleImportFood">导入食物</el-button>

        <div class="filter-section">
          <span class="filter-label">分类：</span>
          <el-select v-model="filterForm.categoryId" placeholder="全部" size="small" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>

          <el-input
            v-model="filterForm.name"
            placeholder="搜索食物名称"
            prefix-icon="el-icon-search"
            size="small"
            class="search-input"
          ></el-input>

          <el-button type="success" size="small" plain @click="handleSearch">搜索</el-button>
          <el-button size="small" plain @click="resetFilter">重置</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="food-table-card">
      <el-table
        v-loading="loading"
        :data="foodList"
        border
        style="width: 100%"
      >
        <el-table-column label="食物信息" min-width="200">
          <template #default="scope">
            <div class="food-info-cell">
              <div class="food-image-container" v-if="scope.row.imageUrl">
                <img
                  :src="scope.row.imageUrl"
                  class="food-image"
                  alt="食物图片"
                  @error="(e) => handleListImageError(e, scope.row)"
                />
              </div>
              <div v-else class="food-image-container">
                <div class="no-image">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </div>
              <div class="food-details">
                <div class="food-name">{{ scope.row.name }}</div>
                <div class="food-id">ID: {{ scope.row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.categoryColor || getCategoryTagType(scope.row.category)">{{ scope.row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="营养成分(每100g)" min-width="280">
          <template #default="scope">
            <div class="nutrition-info">
              <div class="nutrition-item">
                <span class="nutrition-label">热量:</span>
                <span class="nutrition-value">{{ scope.row.calories }}kcal</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">蛋白质:</span>
                <span class="nutrition-value">{{ scope.row.protein }}g</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">脂肪:</span>
                <span class="nutrition-value">{{ scope.row.fat }}g</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">碳水:</span>
                <span class="nutrition-value">{{ scope.row.carbs }}g</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="100" align="center"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" class="view-btn" @click="handleView(scope.row)">查看详情</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" class="delete-btn" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <div class="total-records">
          共 <span class="highlight">{{ total }}</span> 条记录
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 食物详情对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" @close="handleDialogClose">
      <el-form
        ref="foodForm"
        :model="foodForm"
        :rules="foodRules"
        label-width="100px"
        :disabled="dialogType === 'view'"
      >
        <el-form-item label="食物名称" prop="name">
          <el-input v-model="foodForm.name" placeholder="请输入食物名称"></el-input>
        </el-form-item>
        <el-form-item label="食物分类" prop="categoryId">
          <el-select v-model="foodForm.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="食物图片">
          <!-- 查看模式 -->
          <div v-if="dialogType === 'view' && foodForm.imageUrl" class="food-image-preview">
            <img
              :src="foodForm.imageUrl"
              class="food-detail-image"
              alt="食物图片"
              @error="handleImageError"
            />
          </div>

          <!-- 编辑模式 -->
          <div v-else-if="dialogType !== 'view'">
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              style="display: none"
              @change="handleFileChange"
            />

            <div v-if="tempImageUrl" class="food-image-preview clickable" @click="handleImageClick">
              <img :src="tempImageUrl" class="food-detail-image" alt="食物图片预览" />
              <div class="image-overlay">
                <i class="el-icon-upload2"></i>
                <span>点击更换图片</span>
              </div>
            </div>
            <div v-else-if="foodForm.imageUrl" class="food-image-preview clickable" @click="handleImageClick">
              <img
                :src="foodForm.imageUrl"
                class="food-detail-image"
                alt="食物图片"
                @error="handleImageError"
              />
              <div class="image-overlay">
                <i class="el-icon-upload2"></i>
                <span>点击更换图片</span>
              </div>
            </div>
            <div v-else-if="uploadStatus === 'uploading'" class="food-image-preview">
              <div class="loading-image food-detail-image">
                <i class="el-icon-loading"></i>
                <span class="upload-text">上传中...</span>
              </div>
            </div>
            <div v-else class="food-image-uploader" @click="handleImageClick">
              <i class="el-icon-plus image-uploader-icon"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="热量(kcal)" prop="calories">
          <el-input-number v-model="foodForm.calories" :min="0" :precision="1" :step="0.1" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="蛋白质(g)" prop="protein">
          <el-input-number v-model="foodForm.protein" :min="0" :precision="1" :step="0.1" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="脂肪(g)" prop="fat">
          <el-input-number v-model="foodForm.fat" :min="0" :precision="1" :step="0.1" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="碳水(g)" prop="carbs">
          <el-input-number v-model="foodForm.carbs" :min="0" :precision="1" :step="0.1" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="计量单位" prop="measure">
          <el-input v-model="foodForm.measure" placeholder="请输入计量单位，如1杯、2碗等"></el-input>
          <div class="form-item-tip">计量单位可以自由输入，如1杯、2碗、3片等</div>
        </el-form-item>

        <el-form-item label="克数(g)" prop="grams">
          <el-input-number v-model="foodForm.grams" :min="0" :precision="1" :step="0.1" style="width: 100%"></el-input-number>
          <div class="form-item-tip">该计量单位对应的克数</div>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="foodForm.remark" :rows="3" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm" v-if="dialogType !== 'view'">确定</el-button>
      </div>
    </el-dialog>

    <!-- 导入食物对话框 -->
    <el-dialog title="导入食物" :visible.sync="importDialogVisible" width="500px">
      <div class="import-container">
        <div class="import-info">
          <p>请上传包含食物信息的CSV文件，文件中应包含以下列：</p>
          <ul class="import-fields">
            <li><strong>name</strong> - 食物名称（必填）</li>
            <li><strong>categoryId</strong> - 食物分类ID（必填）</li>
            <li><strong>calories</strong> - 热量，单位kcal（必填）</li>
            <li><strong>protein</strong> - 蛋白质，单位g（必填）</li>
            <li><strong>fat</strong> - 脂肪，单位g（必填）</li>
            <li><strong>carbs</strong> - 碳水化合物，单位g（必填）</li>
            <li><strong>measure</strong> - 计量单位（必填）</li>
            <li><strong>grams</strong> - 对应的克数（必填）</li>
            <li><strong>remark</strong> - 备注（选填）</li>
          </ul>
        </div>

        <div class="upload-section">
          <el-upload
            class="upload-csv"
            drag
            action=""
            :http-request="handleCsvUpload"
            :before-upload="beforeCsvUpload"
            :limit="1"
            accept=".csv"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传CSV文件</div>
          </el-upload>
        </div>

        <div class="download-template">
          <el-button type="text" @click="downloadTemplate">下载导入模板</el-button>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { food } from '@/api';
import { mapActions } from 'vuex';

import { parseCSV } from '@/utils/excel'; // 导入CSV解析函数

export default {
  name: 'FoodList',
  data() {
    return {
      // 筛选表单
      filterForm: {
        name: '',
        categoryId: ''
      },
      // 加载状态
      loading: false,
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 食物列表
      foodList: [],
      // 食物分类选项
      categories: [],
      // 对话框相关
      dialogVisible: false,
      dialogType: 'add', // add, edit, view
      dialogTitle: '添加食物',
      // 导入对话框
      importDialogVisible: false,
      // 食物表单
      foodForm: {
        id: null,
        name: '',
        category: '',
        categoryId: null,
        categoryColor: '',
        imageUrl: '',
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        measure: '',  // 计量单位，如1杯、2碗等
        grams: 100,   // 对应的克数
        remark: ''
      },
      // 表单验证规则
      foodRules: {
        name: [
          { required: true, message: '请输入食物名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择食物分类', trigger: 'change' }
        ],
        calories: [
          { required: true, message: '请输入热量', trigger: 'blur' }
        ],
        measure: [
          { required: true, message: '请输入计量单位', trigger: 'blur' }
        ],
        grams: [
          { required: true, message: '请输入对应的克数', trigger: 'blur' }
        ]
      },
      // 图片上传相关
      tempFile: null,
      tempImageUrl: '',
      originalImageUrl: ''
    };
  },
  computed: {
    // 从store获取上传状态
    uploadStatus() {
      return this.$store.getters['food/getUploadStatus'];
    },

    // 从store获取上传进度
    uploadProgress() {
      return this.$store.getters['food/getUploadProgress'];
    }
  },

  created() {
    this.fetchCategories();
    this.fetchFoodList();
  },
  methods: {
    ...mapActions('food', [
      'fetchFoodList',
      'fetchCategories',
      'fetchFoodDetail',
      'addFood',
      'updateFood',
      'deleteFood',
      'getImageDownloadUrl',
      'uploadFoodImage',
      'resetUploadStatus',
      'importFoodFromCsv'
    ]),
    // 获取食物分类
    async fetchCategories() {
      try {
        const response = await food.getFoodCategories();
        if (response.data && response.data.code === 200 && response.data.data) {
          // 将后端返回的分类列表转换为前端需要的格式
          this.categories = response.data.data.map(category => ({
            label: category.name,
            value: category.id,
            color: category.color,
            description: category.description,
            foodCount: category.foodCount,
            sortOrder: category.sortOrder,
            // 保存完整的分类对象以便需要时使用
            raw: category
          }));
        }
      } catch (error) {
        console.error('获取食物分类失败:', error);
        this.$message.error('获取食物分类失败: ' + (error.response?.data?.message || error.message));
      }
    },

    // 获取食物列表
    async fetchFoodList() {
      this.loading = true;
      try {
        const params = {
          keyword: this.filterForm.name,
          categoryId: this.filterForm.categoryId,
          current: this.currentPage,
          size: this.pageSize
        };

        const response = await food.getFoodList(params);

        if (response.data && response.data.code === 200 && response.data.data) {
          const pageData = response.data.data;
          this.foodList = pageData.records || [];
          this.total = pageData.total || 0;

          // 处理食物图片
          this.loadFoodImages();

          // 为每个食物项设置分类颜色
          this.setCategoryColors();
        } else {
          this.foodList = [];
          this.total = 0;
          this.$message.warning('获取食物列表失败');
        }
      } catch (error) {
        console.error('获取食物列表失败:', error);
        this.$message.error('获取食物列表失败: ' + (error.response?.data?.message || error.message));
        this.foodList = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // 为食物列表中的每个项目设置分类颜色
    setCategoryColors() {
      if (!this.categories || !this.foodList) return;

      this.foodList.forEach(food => {
        const category = this.categories.find(c => c.value === food.categoryId);
        if (category) {
          this.$set(food, 'categoryColor', category.color);
        }
      });
    },

    // 加载食物图片
    async loadFoodImages() {
      // 后端已在FoodItemDTO中直接提供预签名URL，不需要任何处理
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.fetchFoodList();
    },

    // 重置筛选
    resetFilter() {
      this.filterForm = {
        name: '',
        categoryId: ''
      };
      this.currentPage = 1;
      this.fetchFoodList();
    },

    // 分页大小变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchFoodList();
    },

    // 页码变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchFoodList();
    },

    // 获取分类标签类型
    getCategoryTagType(category) {
      const typeMap = {
        '谷物类': '',
        '蔬菜类': 'success',
        '水果类': 'warning',
        '肉蛋类': 'danger',
        '奶制品': 'info',
        '豆制品': 'success',
        '零食饮料': 'warning',
        '调味品': 'info',
        '其他': ''
      };
      return typeMap[category] || '';
    },

    // 添加食物
    handleAddFood() {
      this.dialogType = 'add';
      this.dialogTitle = '添加食物';
      this.foodForm = {
        id: null,
        name: '',
        category: '',
        categoryId: null,
        categoryColor: '',
        imageUrl: '',
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        measure: '',  // 计量单位，如1杯、2碗等
        grams: 100,   // 对应的克数
        remark: ''
      };
      this.dialogVisible = true;
    },

    // 编辑食物
    async handleEdit(row) {
      this.dialogType = 'edit';
      this.dialogTitle = '编辑食物';
      this.foodForm = JSON.parse(JSON.stringify(row));

      this.dialogVisible = true;
    },

    // 查看食物
    async handleView(row) {
      this.dialogType = 'view';
      this.dialogTitle = '食物详情';
      // 深拷贝以避免修改原始数据
      this.foodForm = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },

    // 删除食物
    handleDelete(row) {
      this.$confirm(`确定要删除食物 "${row.name}" 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await food.deleteFood(row.id);
          this.$message.success(`已删除食物: ${row.name}`);
          // 重新加载数据
          this.fetchFoodList();
        } catch (error) {
          console.error('删除食物失败:', error);
          this.$message.error('删除食物失败: ' + (error.response?.data?.message || error.message));
        }
      }).catch(() => {
        // 取消删除
      });
    },

    // 处理图片点击事件
    handleImageClick() {
      // 触发文件选择
      this.$refs.fileInput.click();
    },

    // 处理文件选择变化
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 检查文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.$message.error('只支持JPG、PNG和GIF格式的图片');
        return;
      }

      // 检查文件大小（限制为2MB）
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error('图片大小不能超过2MB');
        return;
      }

      // 保存临时文件
      this.tempFile = file;

      try {
        // 无论是编辑模式还是添加模式，都只创建临时预览，不立即上传
        // 只有在用户点击确定按钮提交表单时才上传图片
        this.createTempPreview(file);
      } catch (error) {
        console.error('处理图片失败:', error);
        this.$message.error('处理图片失败: ' + (error.response?.data?.message || error.message));
        this.resetUploadStatus();
      }

      // 清空文件输入，以便再次选择同一文件时能触发change事件
      event.target.value = '';
    },

    // 创建临时预览
    createTempPreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.tempImageUrl = e.target.result;
      };
      reader.onerror = () => {
        this.$message.error('读取图片失败');
      };
      reader.readAsDataURL(file);
    },

    // 处理图片上传
    async handleUploadImage() {
      if (!this.tempFile || !this.foodForm.id) return;

      try {
        // 使用store中的方法上传图片
        const result = await this.uploadFoodImage({
          foodId: this.foodForm.id,
          file: this.tempFile
        });

        if (result) {
          // 更新表单数据
          this.foodForm.imageUrl = result.imageUrl;
          this.$message.success('图片上传成功');
        }
      } catch (error) {
        console.error('上传图片失败:', error);
        this.$message.error('上传图片失败: ' + (error.response?.data?.message || error.message));
      } finally {
        this.tempFile = null;
      }
    },

    // 移除图片
    async handleRemoveImage() {
      if (this.tempImageUrl) {
        // 如果有临时图片，只需清除临时图片相关数据
        this.tempFile = null;
        this.tempImageUrl = '';
        this.$message.success('临时图片已移除');
      } else {
        // 保存原始图片URL，以便取消时恢复
        this.originalImageUrl = this.foodForm.imageUrl;

        // 清除图片相关数据
        this.foodForm.imageUrl = '';
        this.uploadStatus = '';

        this.$message.success('图片已移除，保存后生效');
      }
    },

    // 处理编辑模态框中的图片加载错误
    handleImageError(e) {
      console.error('图片加载失败:', this.foodForm.imageUrl);
      // 显示错误提示
      this.$message.warning('图片加载失败，请点击更换图片');
      // 将图片替换为错误占位图
      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f5f7fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23909399" text-anchor="middle">图片加载失败</text></svg>';
    },

    // 处理列表中的图片加载错误
    handleListImageError(e, row) {
      console.error('列表图片加载失败:', row.imageUrl);
      // 将图片替换为错误占位图（小尺寸）
      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f5f7fa"/><text x="50%" y="50%" font-family="Arial" font-size="8" fill="%23909399" text-anchor="middle">加载失败</text></svg>';
    },

    // 处理对话框关闭事件
    handleDialogClose() {
      // 清理上传状态和临时文件
      this.resetUploadStatus();
      this.tempFile = null;
      this.tempImageUrl = '';

      // 如果有原始图片URL，恢复它（取消编辑时）
      if (this.originalImageUrl && this.dialogType === 'edit') {
        this.foodForm.imageUrl = this.originalImageUrl;
      }

      this.originalImageUrl = '';
    },

    // 处理取消按钮点击
    handleCancel() {
      // 关闭对话框
      this.dialogVisible = false;
    },

    // 提交表单
    submitForm() {
      this.$refs.foodForm.validate(async (valid) => {
        if (valid) {
          try {
            // 准备提交的数据（深拷贝）
            const foodData = JSON.parse(JSON.stringify(this.foodForm));

            // 确保有正确的分类信息
            if (foodData.categoryId) {
              // 如果选择了分类，查找对应的分类名称
              const category = this.categories.find(c => c.value === foodData.categoryId);
              if (category) {
                foodData.category = category.label;
                foodData.categoryColor = category.color;
              }
            }

            if (this.dialogType === 'add') {
              // 添加食物
              const result = await this.addFood(foodData);
              if (result && result.id) {
                this.$message.success(`已添加食物: ${foodData.name}`);

                // 如果有临时文件，上传图片
                if (this.tempFile) {
                  // 更新foodForm的ID
                  this.foodForm.id = result.id;
                  // 上传图片
                  await this.handleUploadImage();
                }
              } else {
                throw new Error('添加食物失败：未获取到食物ID');
              }
            } else if (this.dialogType === 'edit') {
              // 编辑食物 - 统一使用updateFood方法（已经会自动删除imageUrl字段）
              await this.updateFood({ id: foodData.id, foodData });
              this.$message.success(`已更新食物: ${foodData.name}`);

              // 如果有新图片，上传图片
              if (this.tempFile) {
                await this.handleUploadImage();
              }
            }

            // 关闭对话框
            this.dialogVisible = false;
            // 重新加载数据
            this.fetchFoodList();
          } catch (error) {
            console.error('保存食物失败:', error);
            this.$message.error('保存食物失败: ' + (error.response?.data?.message || error.message));
          }
        } else {
          return false;
        }
      });
    },

    // 打开导入食物对话框
    handleImportFood() {
      this.importDialogVisible = true;
    },

    // 下载导入模板
    downloadTemplate() {
      // 创建模板数据
      const templateData = [{
        name: '示例食物',
        categoryId: this.categories.length > 0 ? this.categories[0].value : '',
        calories: 100,
        protein: 10,
        fat: 5,
        carbs: 15,
        measure: '1份',
        grams: 100,
        remark: '这是一个示例'
      }];

      try {
        // 导入excel.js中的downloadExcel函数
        const { downloadExcel } = require('@/utils/excel');
        downloadExcel(templateData, '食物导入模板', 'csv');
      } catch (error) {
        console.error('下载模板失败:', error);
        this.$message.error('下载模板失败: ' + error.message);
      }
    },

    // 文件上传前的检查
    beforeCsvUpload(file) {
      const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
      if (!isCsv) {
        this.$message.error('只能上传CSV文件!');
        return false;
      }
      return true;
    },

    // 处理CSV文件上传
    handleCsvUpload({ file }) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target.result;

          // 使用parseCSV函数解析CSV内容
          const foodItems = parseCSV(content);

          if (foodItems.length === 0) {
            this.$message.error('CSV文件中没有有效数据');
            return;
          }

          // 检查必填字段
          const requiredFields = ['name', 'categoryId', 'calories', 'protein', 'fat', 'carbs', 'measure', 'grams'];
          const firstItem = foodItems[0];
          const missingFields = requiredFields.filter(field => !(field in firstItem));

          if (missingFields.length > 0) {
            this.$message.error(`CSV文件缺少必填字段: ${missingFields.join(', ')}`);
            return;
          }

          // 处理数据类型转换
          const processedItems = foodItems.map(item => {
            const processedItem = { ...item };

            // 处理数字类型字段
            ['calories', 'protein', 'fat', 'carbs', 'grams', 'categoryId'].forEach(field => {
              if (field in processedItem) {
                processedItem[field] = parseFloat(processedItem[field]) || 0;
              }
            });

            return processedItem;
          });

          // 调用导入API
          this.loading = true;
          const response = await food.importFoods(processedItems);
          this.loading = false;

          if (response.data && response.data.code === 200) {
            this.$message.success(`成功导入 ${response.data.data.successCount || 0} 条数据`);
            this.importDialogVisible = false;
            this.fetchFoodList(); // 刷新列表
          } else {
            this.$message.error(response.data?.message || '导入失败');
          }
        } catch (error) {
          console.error('处理CSV失败:', error);
          this.$message.error('处理CSV失败: ' + error.message);
          this.loading = false;
        }
      };

      reader.readAsText(file);
    }
  }
};
</script>

<style scoped>
.food-list-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  align-items: center;
}

.filter-label {
  margin: 0 10px 0 20px;
  color: #606266;
}

.search-input {
  width: 220px;
  margin: 0 10px;
}

.food-table-card {
  margin-bottom: 20px;
}

.food-info-cell {
  display: flex;
  align-items: center;
}

.food-image-container {
  margin-right: 10px;
}

.food-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.no-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.loading-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409EFF;
}

.food-details {
  display: flex;
  flex-direction: column;
}

.food-name {
  font-size: 14px;
  color: #303133;
}

.food-id {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.nutrition-info {
  display: flex;
  flex-wrap: wrap;
}

.nutrition-item {
  margin-right: 15px;
  margin-bottom: 5px;
}

.nutrition-label {
  color: #909399;
  margin-right: 5px;
}

.nutrition-value {
  font-weight: 500;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.total-records {
  font-size: 14px;
  color: #606266;
}

.highlight {
  color: #2a9d5c;
  font-weight: bold;
}

.view-btn {
  color: #2a9d5c;
}

.delete-btn {
  color: #f56c6c;
}

.food-image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.food-image-uploader:hover {
  border-color: #409EFF;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.uploaded-image {
  width: 178px;
  height: 178px;
  display: block;
}

.loading-image.uploaded-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #409EFF;
}

.food-image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.food-detail-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.image-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: none;
}

.food-image-preview {
  position: relative;
}

.food-image-preview:hover .image-actions {
  display: block;
}

.food-image-preview.clickable {
  cursor: pointer;
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 4px;
}

.food-image-preview.clickable:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-text {
  margin-left: 5px;
  font-size: 14px;
}

.form-item-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  padding-top: 4px;
}

/* 导入对话框样式 */
.import-container {
  padding: 10px 0;
}

.import-info {
  margin-bottom: 20px;
}

.import-fields {
  margin-top: 10px;
  padding-left: 20px;
}

.import-fields li {
  margin-bottom: 5px;
}

.upload-section {
  margin-bottom: 20px;
}

.download-template {
  text-align: center;
  margin-top: 10px;
}
</style>