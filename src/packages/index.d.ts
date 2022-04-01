import type { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import type { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'

// 组件配置
export type ConfigType = {
  key: string
  chartKey: string
  conKey: string
  title: string
  category: string
  categoryName: string
  package: string
  image: string | (() => Promise<typeof import('*.png')>)
}

// 数据请求
interface requestConfig {
  data: RequestConfigType,
  // 暂时约定为数据存储区域（未使用）
  requestData: any
}

// Echarts 数据类型
interface EchartsDataType {
  dimensions: string[],
  source: any[]
}
// 组件实例类
export interface PublicConfigType extends requestConfig {
  id: string
  rename?: string
  attr: { x: number; y: number; w: number; h: number; zIndex: number }
  styles: { opacity: number; animations: string[] }
  setPosition: Function
}
export interface CreateComponentType extends PublicConfigType {
  key: string
  chartConfig: ConfigType
  option: GlobalThemeJsonType
}

// 获取组件实例类中某个key对应value类型的方法
export type PickCreateComponentType<T extends keyof CreateComponentType> = Pick<CreateComponentType,T>[T]

// 包分类枚举
export enum PackagesCategoryEnum {
  CHARTS = 'Charts',
  TABLES = 'Tables',
  INFORMATIONS = 'Informations',
  DECORATES = 'Decorates'
}

// 包分类名称
export enum PackagesCategoryName {
  CHARTS = '图表',
  TABLES = '列表',
  INFORMATIONS = '信息',
  DECORATES = '小组件'
}

// 获取组件
export enum FetchComFlagType {
  VIEW,
  CONFIG
}

// 图表包类型
export type PackagesType = {
  [PackagesCategoryEnum.CHARTS]: ConfigType[]
  [PackagesCategoryEnum.INFORMATIONS]: ConfigType[]
  [PackagesCategoryEnum.TABLES]: ConfigType[]
  [PackagesCategoryEnum.DECORATES]: ConfigType[]
}
