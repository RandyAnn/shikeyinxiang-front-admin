// src/store/modules/food.js
import Vue from 'vue';
import { food } from '@/api';

// 初始状态
const state = {
  // 食物列表缓存
  foodListCache: {},
  // 食物详情缓存
  foodDetailCache: {},
  // 食物分类缓存
  categoriesCache: null,
  // 图片下载URL缓存
  imageUrlCache: {},
  // 上传状态
  uploadStatus: '',
  // 上传进度
  uploadProgress: 0
};

// getters
const getters = {
  // 获取食物列表
  getFoodList: (state) => (params) => {
    const cacheKey = generateCacheKey(params);
    return state.foodListCache[cacheKey];
  },

  // 获取食物详情
  getFoodDetail: (state) => (id) => {
    return state.foodDetailCache[id];
  },

  // 获取食物分类
  getCategories: (state) => {
    return state.categoriesCache;
  },

  // 获取图片下载URL
  getImageUrl: (state) => (imageUrl) => {
    return state.imageUrlCache[imageUrl];
  },

  // 获取上传状态
  getUploadStatus: (state) => {
    return state.uploadStatus;
  },

  // 获取上传进度
  getUploadProgress: (state) => {
    return state.uploadProgress;
  }
};

// actions
const actions = {

  // 获取食物列表
  async fetchFoodList({ commit, getters }, params) {
    const cacheKey = generateCacheKey(params);
    // 如果已经缓存，直接返回
    const cachedList = getters.getFoodList(params);
    if (cachedList) {
      return cachedList;
    }

    try {
      const response = await food.getFoodList(params);
      if (response.data && response.data.code === 200 && response.data.data) {
        const foodList = response.data.data;
        // 缓存食物列表
        commit('SET_FOOD_LIST', { cacheKey, list: foodList });
        return foodList;
      }
      return null;
    } catch (error) {
      console.error('获取食物列表失败:', error);
      return null;
    }
  },

  // 获取食物详情
  async fetchFoodDetail({ commit, getters }, id) {
    // 如果已经缓存，直接返回
    const cachedDetail = getters.getFoodDetail(id);
    if (cachedDetail) {
      return cachedDetail;
    }

    try {
      const response = await food.getFoodDetail(id);
      if (response.data && response.data.code === 200 && response.data.data) {
        const foodDetail = response.data.data;
        // 缓存食物详情
        commit('SET_FOOD_DETAIL', { id, detail: foodDetail });
        return foodDetail;
      }
      return null;
    } catch (error) {
      console.error('获取食物详情失败:', error);
      return null;
    }
  },

  // 获取食物分类
  async fetchCategories({ commit, state }) {
    // 如果已经缓存，直接返回
    if (state.categoriesCache) {
      return state.categoriesCache;
    }

    try {
      const response = await food.getFoodCategories();
      if (response.data && response.data.code === 200 && response.data.data) {
        // 后端现在返回的是FoodCategoryDTO对象列表
        const categories = response.data.data.map(category => ({
          label: category.name,
          value: category.id,
          color: category.color,
          description: category.description,
          foodCount: category.foodCount,
          sortOrder: category.sortOrder,
          // 保存完整的分类对象以便需要时使用
          raw: category
        }));
        // 缓存食物分类
        commit('SET_CATEGORIES', categories);
        return categories;
      }
      return [];
    } catch (error) {
      console.error('获取食物分类失败:', error);
      return [];
    }
  },

  // 添加食物
  async addFood({ commit }, foodData) {
    try {
      // 创建一个不包含id字段的新对象
      const foodDataWithoutId = { ...foodData };
      delete foodDataWithoutId.id;

      const response = await food.addFood(foodDataWithoutId);
      if (response.data && response.data.code === 200 && response.data.data) {
        // 清除食物列表缓存，因为列表已经变化
        commit('CLEAR_FOOD_LIST_CACHE');
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('添加食物失败:', error);
      throw error;
    }
  },

  // 更新食物
  async updateFood({ commit }, { id, foodData }) {
    try {
      // 创建一个不包含id和imageUrl字段的新对象
      // 删除imageUrl是为了避免将预签名URL误存为文件路径
      const foodDataWithoutIdAndImage = { ...foodData };
      delete foodDataWithoutIdAndImage.id;
      delete foodDataWithoutIdAndImage.imageUrl;

      const response = await food.updateFood(id, foodDataWithoutIdAndImage);
      if (response.data && response.data.code === 200 && response.data.data) {
        // 清除食物列表缓存和该食物的详情缓存
        commit('CLEAR_FOOD_LIST_CACHE');
        commit('REMOVE_FOOD_DETAIL', id);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('更新食物失败:', error);
      throw error;
    }
  },

  // 删除食物
  async deleteFood({ commit }, id) {
    try {
      const response = await food.deleteFood(id);
      if (response.data && response.data.code === 200) {
        // 清除食物列表缓存和该食物的详情缓存
        commit('CLEAR_FOOD_LIST_CACHE');
        commit('REMOVE_FOOD_DETAIL', id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除食物失败:', error);
      throw error;
    }
  },

  // 获取图片下载URL
  // eslint-disable-next-line
  async getImageDownloadUrl({ commit, getters }, imageUrl) {
    // 后端已在FoodItemDTO中直接返回预签名URL，不再需要单独请求
    return null;
  },

  // 获取图片上传URL
  async getImageUploadUrl({ commit }, { foodId, contentType }) {
    try {
      commit('SET_UPLOAD_STATUS', 'preparing');
      const response = await food.getUploadImageUrl(foodId, contentType);
      if (response.data && response.data.code === 200) {
        return response.data.data;
      }
      commit('SET_UPLOAD_STATUS', 'error');
      return null;
    } catch (error) {
      console.error('获取图片上传URL失败:', error);
      commit('SET_UPLOAD_STATUS', 'error');
      throw error;
    }
  },

  // 上传图片到OSS
  async uploadImageToOSS({ commit }, { uploadUrl, file, contentType }) {
    try {
      commit('SET_UPLOAD_STATUS', 'uploading');
      commit('SET_UPLOAD_PROGRESS', 0);

      // 使用fetch API上传文件
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': contentType
        }
      });

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status} ${response.statusText}`);
      }

      commit('SET_UPLOAD_PROGRESS', 100);
      commit('SET_UPLOAD_STATUS', 'success');
      return true;
    } catch (error) {
      console.error('上传图片到OSS失败:', error);
      commit('SET_UPLOAD_STATUS', 'error');
      throw error;
    }
  },

  // 更新食物图片URL
  async updateFoodImageUrl({ commit }, { foodId, imageUrl }) {
    try {
      const response = await food.updateFoodImageUrl(foodId, imageUrl);
      if (response.data && response.data.code === 200) {
        // 清除食物详情缓存
        commit('REMOVE_FOOD_DETAIL', foodId);
        // 清除食物列表缓存
        commit('CLEAR_FOOD_LIST_CACHE');
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新食物图片URL失败:', error);
      throw error;
    }
  },

  // 完整的图片上传流程
  async uploadFoodImage({ dispatch, commit }, { foodId, file }) {
    try {
      // 1. 获取上传URL
      const uploadData = await dispatch('getImageUploadUrl', {
        foodId,
        contentType: file.type
      });

      if (!uploadData) {
        throw new Error('获取上传URL失败');
      }

      // 2. 解析上传URL和文件路径
      const [uploadUrl, filePath] = uploadData.split(':::');

      // 3. 上传文件到OSS
      await dispatch('uploadImageToOSS', {
        uploadUrl,
        file,
        contentType: file.type
      });

      // 4. 更新食物图片URL
      await dispatch('updateFoodImageUrl', {
        foodId,
        imageUrl: filePath
      });

      // 5. 获取预签名的下载URL
      const response = await food.getFoodDetail(foodId);
      if (response.data && response.data.code === 200 && response.data.data) {
        return {
          imageUrl: response.data.data.imageUrl // 使用后端返回的预签名URL
        };
      }
    } catch (error) {
      commit('SET_UPLOAD_STATUS', 'error');
      throw error;
    }
  },

  // 重置上传状态
  resetUploadStatus({ commit }) {
    commit('SET_UPLOAD_STATUS', '');
    commit('SET_UPLOAD_PROGRESS', 0);
  },

  // 清除缓存
  clearCache({ commit }) {
    commit('CLEAR_FOOD_LIST_CACHE');
    commit('CLEAR_FOOD_DETAIL_CACHE');
    commit('CLEAR_CATEGORIES_CACHE');
    commit('CLEAR_IMAGE_URL_CACHE');
  },

  // 添加食物分类
  async addCategory({ commit }, categoryData) {
    try {
      const response = await food.addCategory(categoryData);
      if (response.data && response.data.code === 200) {
        // 清除分类缓存
        commit('CLEAR_CATEGORIES_CACHE');
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('添加食物分类失败:', error);
      throw error;
    }
  },

  // 更新食物分类
  async updateCategory({ commit }, { id, categoryData }) {
    try {
      const response = await food.updateCategory(id, categoryData);
      if (response.data && response.data.code === 200) {
        // 清除分类缓存和食物列表缓存
        commit('CLEAR_CATEGORIES_CACHE');
        commit('CLEAR_FOOD_LIST_CACHE');
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('更新食物分类失败:', error);
      throw error;
    }
  },

  // 删除食物分类
  async deleteCategory({ commit }, categoryId) {
    try {
      const response = await food.deleteCategory(categoryId);
      if (response.data && response.data.code === 200) {
        // 清除分类缓存和食物列表缓存
        commit('CLEAR_CATEGORIES_CACHE');
        commit('CLEAR_FOOD_LIST_CACHE');
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除食物分类失败:', error);
      throw error;
    }
  }
};

// mutations
const mutations = {

  // 设置食物列表缓存
  SET_FOOD_LIST(state, { cacheKey, list }) {
    Vue.set(state.foodListCache, cacheKey, list);

    // 设置缓存过期时间（5分钟）
    setTimeout(() => {
      Vue.delete(state.foodListCache, cacheKey);
    }, 5 * 60 * 1000);
  },

  // 设置食物详情缓存
  SET_FOOD_DETAIL(state, { id, detail }) {
    Vue.set(state.foodDetailCache, id, detail);

    // 设置缓存过期时间（10分钟）
    setTimeout(() => {
      Vue.delete(state.foodDetailCache, id);
    }, 10 * 60 * 1000);
  },

  // 设置食物分类缓存
  SET_CATEGORIES(state, categories) {
    state.categoriesCache = categories;

    // 设置缓存过期时间（1小时）
    setTimeout(() => {
      state.categoriesCache = null;
    }, 60 * 60 * 1000);
  },

  // 移除食物详情缓存
  REMOVE_FOOD_DETAIL(state, id) {
    Vue.delete(state.foodDetailCache, id);
  },

  // 设置图片下载URL缓存
  SET_IMAGE_URL(state, { imageUrl, downloadUrl }) {
    Vue.set(state.imageUrlCache, imageUrl, downloadUrl);

    // 设置缓存过期时间（30分钟）
    setTimeout(() => {
      Vue.delete(state.imageUrlCache, imageUrl);
    }, 30 * 60 * 1000);
  },

  // 设置上传状态
  SET_UPLOAD_STATUS(state, status) {
    state.uploadStatus = status;
  },

  // 设置上传进度
  SET_UPLOAD_PROGRESS(state, progress) {
    state.uploadProgress = progress;
  },

  // 清除食物列表缓存
  CLEAR_FOOD_LIST_CACHE(state) {
    state.foodListCache = {};
  },

  // 清除食物详情缓存
  CLEAR_FOOD_DETAIL_CACHE(state) {
    state.foodDetailCache = {};
  },

  // 清除食物分类缓存
  CLEAR_CATEGORIES_CACHE(state) {
    state.categoriesCache = null;
  },

  // 清除图片URL缓存
  CLEAR_IMAGE_URL_CACHE(state) {
    state.imageUrlCache = {};
  }
};

// 辅助函数：生成缓存键
function generateCacheKey(params) {
  return JSON.stringify(params);
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
