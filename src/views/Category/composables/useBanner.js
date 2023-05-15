import { onMounted, ref } from 'vue'
import { getBannerAPI } from '@/apis/home'
// 封装 banner 相关代码

export function useBanner() {
    const bannerList = ref([])

    const getBanner = async () => {
        const res = await getBannerAPI({
            distributionSite: '2'
        })
        bannerList.value = res.result
    }

    onMounted(() => {
        getBanner()
    })

    return {
        bannerList
    }
}

