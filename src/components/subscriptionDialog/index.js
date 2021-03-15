/*
 * @Author: ShenLing
 * @Date: 2021-01-05 15:26:52
 * @LastEditors: Shenling
 * @LastEditTime: 2021-01-05 17:49:05
 */
import SubscriptionDialog from './subscriptionDialog'

let componentInstance = null
let getComponentInstance = ({ title, onCancel, onConfirm }) => {
	componentInstance =
		componentInstance ||
		SubscriptionDialog.newInstance({
			title,
			onCancel,
			onConfirm,
		})
	return componentInstance
}

export default {
	show ({ title, onCancel, onConfirm }) {
		getComponentInstance({ title, onCancel, onConfirm })
	},
	close () {
		if (componentInstance) {
			componentInstance.destroy()
			componentInstance = null
		}
	},
}
