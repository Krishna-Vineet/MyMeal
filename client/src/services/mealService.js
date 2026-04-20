import api from "../api/axios"

export const mealService = {
  getPlans: async () => {
    const response = await api.get("/meal-plans")
    return response.data
  },

  createPlan: async (planData) => {
    const response = await api.post("/meal-plans", planData)
    return response.data
  },

  updatePlan: async (id, planData) => {
    const response = await api.patch(`/meal-plans/${id}`, planData)
    return response.data
  }
}
