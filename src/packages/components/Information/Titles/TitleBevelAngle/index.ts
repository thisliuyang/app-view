import TitleBevelAngle from './index.vue'
import image from '@/assets/images/chart/informations/title_diamond2.png'
import { ConfigType } from '@/packages/index.d'
import { ChatCategoryEnum } from '../../index.d'

export const TitleBevelAngleConfig: ConfigType = {
  key: 'TitleBevelAngle',
  title: '斜角标题',
  category: ChatCategoryEnum.TITLE,
  node: TitleBevelAngle,
  image
}