// src/store/modules/dashboard.js
import { getDashboardStats, getNutritionTrend } from '@/api/dashboard'

const state = {
  stats: {},
  nutritionTrends: {}, // 使用对象存储不同period的数据
  loading: {
    stats: false,
    nutritionTrend: false
  },
  // 缓存时间戳
  lastFetchTime: {
    nutritionTrend: {}
  }
}

const mutations = {
  SET_STATS(state, data) {
    state.stats = data
  },
  SET_NUTRITION_TREND(state, { period, data }) {
    state.nutritionTrends[period] = data
  },
  SET_LOADING(state, { key, value }) {
    state.loading[key] = value
  },
  SET_FETCH_TIME(state, { key, period, time }) {
    if (!state.lastFetchTime[key]) {
      state.lastFetchTime[key] = {}
    }
    state.lastFetchTime[key][period] = time
  }
}

const actions = {
  async fetchDashboardStats({ commit }) {
    commit('SET_LOADING', { key: 'stats', value: true })
    try {
      const response = await getDashboardStats()
      if (response && response.data && response.data.code === 200) {
        commit('SET_STATS', response.data.data)
      }
      return response
    } catch (error) {
      console.error('获取仪表盘数据失败', error)
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', { key: 'stats', value: false })
    }
  },

  // 特殊的action，用于处理初始加载
  async initializeNutritionTrends({ dispatch }) {
    // 先加载月度数据
    await dispatch('fetchNutritionTrend', { period: 'month', force: true })

    // 短暂延迟后加载其他周期数据
    setTimeout(async () => {
      await Promise.all([
        dispatch('fetchNutritionTrend', { period: 'week' }),
        dispatch('fetchNutritionTrend', { period: 'year' })
      ])
    }, 500)
  },

  async fetchNutritionTrend({ commit, state }, { period = 'month', force = false } = {}) {
    // 检查缓存是否有效（5分钟内）
    const now = Date.now()
    const lastFetchTime = state.lastFetchTime.nutritionTrend?.[period] || 0
    const cacheExpiration = 5 * 60 * 1000 // 5分钟

    // 如果缓存有效且不强制刷新，直接返回缓存数据
    if (!force && now - lastFetchTime < cacheExpiration && state.nutritionTrends[period] &&
        state.nutritionTrends[period].dateList && state.nutritionTrends[period].dateList.length > 0) {
      return { data: { code: 200, data: state.nutritionTrends[period] } }
    }

    // 设置加载状态
    commit('SET_LOADING', { key: 'nutritionTrend', value: true })

    try {
      const response = await getNutritionTrend(period)

      if (response && response.data && response.data.code === 200) {
        const data = response.data.data

        // 确保数据有效
        if (data && data.dateList && data.dateList.length > 0) {
          // 更新store中的数据
          commit('SET_NUTRITION_TREND', { period, data })
          commit('SET_FETCH_TIME', { key: 'nutritionTrend', period, time: now })
        }
      }

      return response
    } catch (error) {
      console.error(`Error fetching nutrition trend for period: ${period}`, error)
      return Promise.reject(error)
    } finally {
      // 无论成功失败，都重置加载状态
      commit('SET_LOADING', { key: 'nutritionTrend', value: false })
    }
  }
}

const getters = {
  dashboardStats: state => state.stats,
  nutritionTrend: state => period => state.nutritionTrends[period] || {
    dateList: [],
    calorieList: [],
    proteinList: [],
    carbsList: [],
    fatList: []
  },
  isLoading: state => key => state.loading[key]
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
