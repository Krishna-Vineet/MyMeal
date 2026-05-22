import api from "../api/axios"

export const mealService = {
  getPlans: async () => {
    const { data } = await api.get("meal-plans")
    return data
  },

  createPlan: async (planData) => {
    const { data } = await api.post("meal-plans", planData)
    return data.mealPlan ?? data
  },

  updatePlan: async (id, planData) => {
    const { data } = await api.patch(`meal-plans/${id}`, planData)
    return data.mealPlan ?? data
  },

  deletePlan: async (id) => {
    const { data } = await api.delete(`meal-plans/${id}`)
    return data
  },
}
