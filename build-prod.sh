#!/bin/bash
###
 # @Author: liuyang liuyang@metadata.net.cn
 # @Date: 2022-11-07 14:59:51
 # @LastEditors: liuyang liuyang@metadata.net.cn
 # @LastEditTime: 2023-02-28 17:32:11
 # @FilePath: /build-pro.sh
 # @Description: v1.1.0
 # 
 # 前提需要ssh 生成秘钥 配置免密登录
###

remote="${1:-yangzi}"
remote_port="${2:-22}"
remote_app_dir=/data/app-pro
remote_html_deploy_sh=view_html_deploy.sh
package_name=dist
package_suffix=zip
package_full_name=dist.$package_suffix

echo '##########START##########'
echo
echo '1. build...'
yarn build

echo
echo
echo '#########################'
echo
echo "2. zip..."
rm -rf ${package_full_name}
zip -r ${package_full_name} ./$package_name

echo
echo '#########################'
echo
echo "3. scp -P ${remote_port} -r ./${package_full_name} ${remote}:${remote_app_dir}"
scp -P ${remote_port} -r ./${package_full_name} ${remote}:${remote_app_dir}

echo
echo '#########################'
echo
echo "4. ssh -p ${remote_port} ${remote} cd ${remote_app_dir} sh ${remote_html_deploy_sh} ${package_full_name}"

ssh -p ${remote_port} "${remote}" "cd ${remote_app_dir} ; sh ${remote_html_deploy_sh} ${package_full_name}"

echo '###########END###########'
