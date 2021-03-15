import DeleteNotice from './deleteNotice'

let componentInstance = null
let getComponentInstance = (
	{
		message,
		onCancel,
		onConfirm
	}
) => {
	componentInstance = componentInstance || DeleteNotice.newInstance(
		{
			message,
			onCancel,
			onConfirm
		}
	)
	return componentInstance
}

export default {
	show ({
		message,
		onCancel,
		onConfirm
	}) {
		getComponentInstance({ message, onCancel, onConfirm })
	},
	close () {
		if (componentInstance) {
			componentInstance.destroy()
			componentInstance = null
		}
	}
}
