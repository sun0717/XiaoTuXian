// 封装分类数据业务相关代码
import { onMounted, ref } from "vue";
import { getCategoryAPI } from "@/apis/category";
import { useRoute } from "vue-router";
import { onBeforeRouteUpdate } from "vue-router";

export function useCategory() {
  const categoryData = ref({});
  const route = useRoute();
  const getCategory = async (id = route.params.id) => {
    const res = await getCategoryAPI(id);
    categoryData.value = res.result;
  };
  onMounted(() => {
    getCategory();
  });
  onBeforeRouteUpdate((to) => {
    // 用 to 目标路由解决参数携带问题
    getCategory(to.params.id);
  });
  return {
    categoryData,
  };
}
