'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	ListView,
	Text,
	ViewPropTypes,
	View,
	FlatList
} from 'react-native';

import SwipeRow from './SwipeRow';

/**
 * ListView that renders SwipeRows.
 */
class SwipeListView extends Component {

	constructor(props){
		super(props);
		this._rows = {};
		this.openCellId = null;
	}

	setScrollEnabled(enable) {
		this._listView.setNativeProps({scrollEnabled: enable});
	}

	safeCloseOpenRow() {
		// if the openCellId is stale due to deleting a row this could be undefined
		if (this._rows[this.openCellId]) {
			this._rows[this.openCellId].closeRow();
		}
	}

	rowSwipeGestureBegan(id) {
		if (this.props.closeOnRowBeginSwipe && this.openCellId && this.openCellId !== id) {
			this.safeCloseOpenRow();
		}

		if (this.props.swipeGestureBegan) {
			this.props.swipeGestureBegan(id);
		}
	}

	onRowOpen(index,rowMap) {
		// const cellIdentifier = `${secId}${rowId}`;
		if (this.openCellId != null && this.openCellId !== index) {
			this.safeCloseOpenRow();
		}
		this.openCellId = index;
		this.props.onRowOpen && this.props.onRowOpen(index, rowMap);
	}

	onRowPress(id) {
		if (this.openCellId) {
			if (this.props.closeOnRowPress) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
	}

	onScroll(e) {
		if (this.openCellId) {
			// if (this.props.closeOnScroll) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			// }
		}
		this.props.onScroll && this.props.onScroll(e);
	}

	onRefresh(e) {
		// if (this.openCellId) {
			// if (this.props.closeOnScroll) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			// }
		// }
		this.props.onRefresh && this.props.onRefresh(e);
	}

	setRefs(ref) {
		this._listView = ref;
		this.props.listViewRef && this.props.listViewRef(ref);
	}

	renderRow({item,index}){
	// renderRow(rowData, secId, rowId, rowMap) {
		// const Component = this.props.renderRow(rowData, secId, rowId, rowMap);
		// item.name = item.name +'---'+this.props.showAdd
		// if(this.props.showAdd){
		// 	this.openCellId=null
		// }
		const Component = this.props.renderRow(item,this._rows[index],index);
		if (!this.props.renderHiddenRow) {
			return React.cloneElement(
				Component,
				{
					...Component.props,
					ref: row => this._rows[index] = row,
					onRowOpen: _ => this.onRowOpen(index, this._rows),
					onRowDidOpen: _ => this.props.onRowDidOpen && this.props.onRowDidOpen(index, this._rows),
					onRowClose: _ => this.props.onRowClose && this.props.onRowClose(index, this._rows),
					onRowDidClose: _ => this.props.onRowDidClose && this.props.onRowDidClose(index, this._rows),
					onRowPress: _ => this.onRowPress(index),
					setScrollEnabled: enable => this.setScrollEnabled(enable),
					swipeGestureBegan: _ => this.rowSwipeGestureBegan(index)
				}
			);
			// return React.cloneElement(
			// 	Component,
			// 	{
			// 		...Component.props,
			// 		ref: row => this._rows[`${secId}${rowId}`] = row,
			// 		onRowOpen: _ => this.onRowOpen(secId, rowId, this._rows),
			// 		onRowDidOpen: _ => this.props.onRowDidOpen && this.props.onRowDidOpen(secId, rowId, this._rows),
			// 		onRowClose: _ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows),
			// 		onRowDidClose: _ => this.props.onRowDidClose && this.props.onRowDidClose(secId, rowId, this._rows),
			// 		onRowPress: _ => this.onRowPress(`${secId}${rowId}`),
			// 		setScrollEnabled: enable => this.setScrollEnabled(enable),
			// 		swipeGestureBegan: _ => this.rowSwipeGestureBegan(`${secId}${rowId}`)
			// 	}
			// );
		} else {
			const previewRowId = this.props.dataSource && this.props.dataSource.getRowIDForFlatIndex(this.props.previewRowIndex || 0);
			return (
				<SwipeRow
					ref={row => this._rows[`${secId}${rowId}`] = row}
					swipeGestureBegan={ _ => this.rowSwipeGestureBegan(`${secId}${rowId}`) }
					onRowOpen={ _ => this.onRowOpen(secId, rowId, this._rows) }
					onRowDidOpen={ _ => this.props.onRowDidOpen && this.props.onRowDidOpen(secId, rowId, this._rows)}
					onRowClose={ _ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows) }
					onRowDidClose={ _ => this.props.onRowDidClose && this.props.onRowDidClose(secId, rowId, this._rows) }
					onRowPress={ _ => this.onRowPress(`${secId}${rowId}`) }
					setScrollEnabled={ (enable) => this.setScrollEnabled(enable) }
					leftOpenValue={rowData.leftOpenValue || this.props.leftOpenValue}
					rightOpenValue={rowData.rightOpenValue || this.props.rightOpenValue}
					closeOnRowPress={rowData.closeOnRowPress || this.props.closeOnRowPress}
					disableLeftSwipe={rowData.disableLeftSwipe || this.props.disableLeftSwipe}
					disableRightSwipe={rowData.disableRightSwipe || this.props.disableRightSwipe}
					stopLeftSwipe={rowData.stopLeftSwipe || this.props.stopLeftSwipe}
					stopRightSwipe={rowData.stopRightSwipe || this.props.stopRightSwipe}
					recalculateHiddenLayout={this.props.recalculateHiddenLayout}
					style={this.props.swipeRowStyle}
					preview={(this.props.previewFirstRow || this.props.previewRowIndex) && rowId === previewRowId}
					previewDuration={this.props.previewDuration}
					previewOpenValue={this.props.previewOpenValue}
					tension={this.props.tension}
					friction={this.props.friction}
					directionalDistanceChangeThreshold={this.props.directionalDistanceChangeThreshold}
					swipeToOpenPercent={this.props.swipeToOpenPercent}
					swipeToOpenVelocityContribution={this.props.swipeToOpenVelocityContribution}
					swipeToClosePercent={this.props.swipeToClosePercent}
				>
					{this.props.renderHiddenRow(rowData, secId, rowId, this._rows)}
					{this.props.renderRow(rowData, secId, rowId, this._rows)}
				</SwipeRow>
			);
		}
	}

	render() {
		const { renderListView, ...props } = this.props;

		if (renderListView) {
			return renderListView(
				props,
				this.setRefs.bind(this),
				//this.onScroll.bind(this),
				this.renderRow.bind(this, this._rows),
			);
		}

		return (
			// <ListView
				// {...props}
				// ref={ c => this.setRefs(c) }
				//onScroll={ e => this.onScroll(e)}
				// renderRow={(rowData, secId, rowId) => this.renderRow(rowData, secId, rowId, this._rows)}
			// />
			<FlatList
				{...props}
				onRefresh={e => this.onRefresh(e) }
				onScroll={ e => this.onScroll(e)}
				ref={ c => this.setRefs(c) }
				renderItem={(rowData) => this.renderRow(rowData)}
			/>
		)
	}

}

SwipeListView.propTypes = {
	/**
	 * To render a custom ListView component, if you don't want to use ReactNative one.
	 */
	renderListView: PropTypes.func,
	/**
	 * How to render a row. Should return a valid React Element.
	 */
	renderRow: PropTypes.func.isRequired,
	/**
	 * How to render a hidden row (renders behind the row). Should return a valid React Element.
	 * This is required unless renderRow is passing a SwipeRow.
	 */
	renderHiddenRow: PropTypes.func,
	/**
	 * TranslateX value for opening the row to the left (positive number)
	 */
	leftOpenValue: PropTypes.number,
	/**
	 * TranslateX value for opening the row to the right (negative number)
	 */
	rightOpenValue: PropTypes.number,
	/**
	 * TranslateX value for stop the row to the left (positive number)
	 */
	stopLeftSwipe: PropTypes.number,
	/**
	 * TranslateX value for stop the row to the right (negative number)
	 */
	stopRightSwipe: PropTypes.number,
	/**
	 * Should open rows be closed when the listView begins scrolling
	 */
	closeOnScroll: PropTypes.bool,
	/**
	 * Should open rows be closed when a row is pressed
	 */
	closeOnRowPress: PropTypes.bool,
	/**
	 * Should open rows be closed when a row begins to swipe open
	 */
	closeOnRowBeginSwipe: PropTypes.bool,
	/**
	 * Disable ability to swipe rows left
	 */
	disableLeftSwipe: PropTypes.bool,
	/**
	 * Disable ability to swipe rows right
	 */
	disableRightSwipe: PropTypes.bool,
	/**
	 * Enable hidden row onLayout calculations to run always.
	 *
	 * By default, hidden row size calculations are only done on the first onLayout event
	 * for performance reasons.
	 * Passing ```true``` here will cause calculations to run on every onLayout event.
	 * You may want to do this if your rows' sizes can change.
	 * One case is a SwipeListView with rows of different heights and an options to delete rows.
	 */
	recalculateHiddenLayout: PropTypes.bool,
	/**
	 * Called when a swipe row is animating swipe
	 */
	swipeGestureBegan: PropTypes.func,
	/**
	 * Called when a swipe row is animating open
	 */
	onRowOpen: PropTypes.func,
	/**
	 * Called when a swipe row has animated open
	 */
	onRowDidOpen: PropTypes.func,
	/**
	 * Called when a swipe row is animating closed
	 */
	onRowClose: PropTypes.func,
	/**
	 * Called when a swipe row has animated closed
	 */
	onRowDidClose: PropTypes.func,
	/**
	 * Styles for the parent wrapper View of the SwipeRow
	 */
	swipeRowStyle: ViewPropTypes.style,
	/**
	 * Called when the ListView ref is set and passes a ref to the ListView
	 * e.g. listViewRef={ ref => this._swipeListViewRef = ref }
	 */
	listViewRef: PropTypes.func,
	/**
	 * Should the first SwipeRow do a slide out preview to show that the list is swipeable
	 */
	previewFirstRow: PropTypes.bool,
	/**
	 * Should the specified rowId do a slide out preview to show that the list is swipeable
	 * Note: This ID will be passed to this function to get the correct row index
	 * https://facebook.github.io/react-native/docs/listviewdatasource.html#getrowidforflatindex
	 */
	previewRowIndex: PropTypes.number,
	/**
	 * Duration of the slide out preview animation (milliseconds)
	 */
	previewDuration: PropTypes.number,
	/**
	 * TranslateX value for the slide out preview animation
	 * Default: 0.5 * props.rightOpenValue
	 */
	previewOpenValue: PropTypes.number,
	/**
	 * Friction for the open / close animation
	 */
	friction: PropTypes.number,
	/**
	 * Tension for the open / close animation
	 */
	tension: PropTypes.number,
	/**
	 * The dx value used to detect when a user has begun a swipe gesture
	 */
	directionalDistanceChangeThreshold: PropTypes.number,
	/**
	 * What % of the left/right openValue does the user need to swipe
	 * past to trigger the row opening.
	 */
	swipeToOpenPercent: PropTypes.number,
	/**
	 * Describes how much the ending velocity of the gesture affects whether the swipe will result in the item being closed or open.
	 * A velocity factor of 0 means that the velocity will have no bearing on whether the swipe settles on a closed or open position
	 * and it'll just take into consideration the swipeToOpenPercent.
	 */
	swipeToOpenVelocityContribution: PropTypes.number,
	/**
	 * What % of the left/right openValue does the user need to swipe
	 * past to trigger the row closing.
	 */
	swipeToClosePercent: PropTypes.number
}

SwipeListView.defaultProps = {
	leftOpenValue: 0,
	rightOpenValue: 0,
	closeOnRowBeginSwipe: false,
	closeOnScroll: true,
	closeOnRowPress: true,
	disableLeftSwipe: false,
	disableRightSwipe: false,
	recalculateHiddenLayout: false,
	previewFirstRow: false,
	directionalDistanceChangeThreshold: 2,
	swipeToOpenPercent: 50,
	swipeToOpenVelocityContribution: 0,
	swipeToClosePercent: 50
}

export default SwipeListView;
