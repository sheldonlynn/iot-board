/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Action from '../actionNames'
import ModalDialog from './modalDialog.ui.js'

const initialState = {
    dialogId: null,
    isVisible: false,
    data: {}
};

function showModalSideeffect(id) {
    const $modal = $('.ui.modal.' + id);

    if (!$modal.length) {
        throw new Error("Can not find Modal with id", id, $modal);
    }

    $modal.modal('show');
}

function closeModalSideeffect(id) {
    $('.ui.modal.' + id).modal('hide');
}

function updateModalVisibility(stateAfter, stateBefore) {
    const dialogBefore = stateBefore.modalDialog;
    const dialogAfter = stateAfter.modalDialog;

    if (dialogBefore.isVisible !== dialogAfter.isVisible) {
        if (stateAfter.modalDialog.isVisible) {
            showModalSideeffect(dialogAfter.dialogId);
        }
        else {
            closeModalSideeffect(dialogBefore.dialogId);
        }
    }
    else if (dialogBefore.dialogId && dialogAfter.dialogId && dialogBefore.dialogId !== dialogAfter.dialogId) {
        closeModalSideeffect(dialogBefore.dialogId);
        showModalSideeffect(dialogAfter.dialogId);
    }
}


export function showModal(id, data = {}) {
    return (dispatch, getState) => {
        const stateBefore = getState();
        dispatch({
            type: Action.SHOW_MODAL,
            dialogId: id,
            data
        });

        const stateAfter = getState();
        updateModalVisibility(stateAfter, stateBefore);
    }
}

export function closeModal() {
    return (dispatch, getState) => {
        const stateBefore = getState();
        dispatch({
            type: Action.HIDE_MODAL
        });

        const stateAfter = getState();
        updateModalVisibility(stateAfter, stateBefore);
    }
}

export function addError(message) {
    return {
        type: Action.MODAL_ADD_USER_MESSAGE,
        kind: "error",
        message: message
    }
}

export function addInfo(message) {
    return {
        type: Action.MODAL_ADD_USER_MESSAGE,
        kind: "info",
        message: message
    }
}

export function deleteUserMessage(userMessage) {
    return {
        type: Action.MODAL_DELETED_USER_MESSAGE,
        message: userMessage
    }
}

export function modalDialog(state = initialState, action) {
    switch (action.type) {
        case Action.SHOW_MODAL:
            return Object.assign({}, state, {
                dialogId: action.dialogId,
                data: action.data,
                isVisible: true,
                errors: []
            });
        case Action.HIDE_MODAL:
            return Object.assign({}, state, {
                dialogId: null,
                data: null,
                isVisible: false,
                errors: []
            });
        case Action.MODAL_ADD_USER_MESSAGE: {
            const stateErrors = state.errors || []
            const errors = [...stateErrors, {text: action.message, kind: action.kind}]
            return Object.assign({}, state, {
                errors: errors
            });
        }
        case Action.MODAL_DELETED_USER_MESSAGE: {
            const errors = _.filter([...state.errors], (e) => e.text != action.message.text)
            return Object.assign({}, state, {
                errors: errors
            });
        }
        default:
            return state;
    }
}
