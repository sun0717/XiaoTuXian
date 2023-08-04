// 封装购物车模块
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "./userStore";
import { insertCartAPI, findNewCartListAPI, delCartAPI } from "@/apis/cart";
export const useCartStore = defineStore(
  "cart",
  () => {
    const userStore = useUserStore();
    const isLogin = computed(() => userStore.userInfo.token);
    // 1. 定义state - cartList
    const cartList = ref([]);
    // 获取最新的购物车列表
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
    // 2. 定义action - addCart
    const addCart = async (goods) => {
      const { skuId, count } = goods
      if (isLogin.value) {
        // 登录之后的加入购物车逻辑
        await insertCartAPI({ skuId, count });
        updateNewList();
      } else {
        // 添加购物车操作
        // 已添加过 - count + 1
        // 没有添加过 - 直接push
        // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
        const item = cartList.value.find((item) => goods.skuId === item.skuId);
        if (item) {
          // 找到了
          item.count++;
        } else {
          // 没找到
          cartList.value.push(goods);
        }
      }
    };
    // 3. 删除购物车
    const delCart = async (skuId) => {
      if (isLogin.value) {
        // 调用接口实现接口购物车中的删除功能
        await delCartAPI([skuId]);
        updateNewList();
      } else {
        // 思路：
        // 1. 找到要删除项的下标值 - splice
        // 2. 使用数组的过滤方法 filter
        const idx = cartList.value.findIndex((item) => skuId === item.skuId);
        cartList.value.splice(idx, 1);
      }
    };

    // 清除购物车
    const clearCart = () => {
      cartList.value = []
    }

    // 单选功能
    const singleCheck = (skuId, selected) => {
      // 通过skuId找到要修改的那一项，然后把它的selected修改为传过来的selected
      const item = cartList.value.find((item) => item.skuId === skuId);
      item.selected = selected;
    };

    // 列表购物车-全选

    // 核心思路：
    // 1、操作单选决定全选：只有当cartList的所有项都为true时，全选状态才为true
    // 2、操作全选决定单选：cartList 中的所有项的 selecte 都要跟着一起变
    const allCheck = (selected) => {
      // 通过skuId找到要修改的那一项，然后把它的selected修改为传过来的selected
      cartList.value.forEach((item) => (item.selected = selected));
    };
    // 计算属性
    // 1. 总的数量 所有项的count之和
    const allCount = computed(() =>
      cartList.value.reduce((a, c) => a + c.count, 0)
    );
    // 2. 总价     所有项的count*price之和
    const allPrice = computed(() =>
      cartList.value.reduce((a, c) => a + c.count * c.price, 0)
    );

    // 3. 已选择数量
    const selectedCount = computed(() =>
      cartList.value
        .filter((item) => item.selected)
        .reduce((a, c) => a + c.count, 0)
    );

    // 4. 已选择商品价钱合计
    const selectedPrice = computed(() =>
      cartList.value
        .filter((item) => item.selected)
        .reduce((a, c) => a + c.count * c.price, 0)
    );
    // 是否全选
    const isAll = computed(() => cartList.value.every((item) => item.selected));
    return {
      cartList,
      addCart,
      delCart,
      allCount,
      allPrice,
      singleCheck,
      isAll,
      allCheck,
      selectedCount,
      selectedPrice,
      clearCart,
      updateNewList
    };
  },
  {
    persist: true,
  }
);
