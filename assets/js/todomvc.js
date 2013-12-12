$(function () {
    'use strict';

    var Utils = {
        pluralize: function (count, word) {
            return count === 1 ? word : word + 's';
        }
    };

    var App = {
        init: function () {
            this.ENTER_KEY = 13;
            this.cacheElements();
            this.bindEvents();
            this.refreshUI();
        },
        cacheElements: function () {
            this.todoTemplate = Handlebars.compile($('#todo-template').html());
            this.footerTemplate = Handlebars.compile($('#footer-template').html());
            this.$todoApp = $('#todoapp');
            this.$header = this.$todoApp.find('#header');
            this.$main = this.$todoApp.find('#main');
            this.$footer = this.$todoApp.find('#footer');
            this.$newTodo = this.$header.find('#new-todo');
            this.$toggleAll = this.$main.find('#toggle-all');
            this.$todoList = this.$main.find('#todo-list');
        },
        bindEvents: function () {
            this.$newTodo.on('keyup', this.createTaskItem);
            this.$footer.on('click', '#clear-completed', this.destroyCompleted);
            var list = this.$todoList;
            list.on('click', '.destroy', this.deleteTaskItem);
            list.on('change', '.toggle', this.toggle);
            list.on('dblclick', 'label', this.edit);
            list.on('keypress', '.edit', this.blurOnEnter);
            list.on('blur', '.edit', this.updateTask);
            this.$toggleAll.on('change', this.toggleAll);
        },
        displayTodos: function () {
            var self = this;
            socket.get('/tasks', function (allTasks) {
                self.$todoList.html(self.todoTemplate(allTasks));
                var activeTodoCount = self.uncompletedTodoCount(allTasks);
                self.renderFooter(allTasks.length, activeTodoCount)
                if (allTasks.length === 0 || allTasks.length === activeTodoCount) {
                    self.$toggleAll.prop('checked', false);
                }
            });
        },
        refreshUI: function () {
            this.displayTodos();
        },
        createTaskItem: function (e) {
            var input_field = $(this);
            var new_todo_task = $.trim(input_field.val());
            if (e.which !== App.ENTER_KEY || !new_todo_task) {
                return
            }
            input_field.val('');
            socket.post('/tasks', {title: new_todo_task, completed: false}, App.refreshOnSuccess);
        },
        refreshOnSuccess: function (response) {
            App.refreshUI();
        },
        deleteTaskItem: function () {
            var id = App.currentTaskId(this);
            socket.delete('/tasks/' + id, App.refreshOnSuccess);
        },
        uncompletedTodoCount: function (storedTodos) {
            var count = 0;
            $.each(storedTodos, function (i, val) {
                if (!val.completed) {
                    count++;
                }
            });
            return count;
        },
        renderFooter: function (todoCount, uncompletedTodoCount) {
            var footer = {
                activeTodoCount: uncompletedTodoCount,
                activeTodoWord: Utils.pluralize(uncompletedTodoCount, 'item'),
                completedTodos: todoCount - uncompletedTodoCount
            };

            this.$footer.toggle(!!todoCount);
            this.$footer.html(this.footerTemplate(footer));
        },
        destroyCompleted: function () {
            var ids = App.selectTaskIds(function (element) {
                var selectBox = element.find(':checkbox');
                return selectBox.is(':checked')
            });
            socket.delete('/tasks/completed', {ids: ids}, App.refreshOnSuccess);
        },
        toggle: function () {
            var id = App.currentTaskId(this);
            socket.put('/tasks/' + id, {completed: !!this.checked}, App.refreshOnSuccess);
        },
        toggleAll: function () {
            var isChecked = $(this).prop('checked');
            var ids = App.selectTaskIds(function () {
                return true;
            });
            socket.post('/tasks/completed', {completed: isChecked, ids: ids}, App.refreshOnSuccess);
        },
        edit: function () {
            var $input = $(this).closest('li').addClass('editing').find('.edit');
            var val = $input.val();
            $input.val(val).focus();
        },
        blurOnEnter: function (e) {
            if (e.which === App.ENTER_KEY) {
                e.target.blur();
            }
        },
        updateTask: function () {
            var val = $.trim($(this).removeClass('editing').val());
            var id = App.currentTaskId(this);
            socket.put('/tasks/' + id, {title: val}, App.refreshOnSuccess);
        },
        currentTaskId: function (element) {
            return $(element).closest('li').data('id');
        },
        selectTaskIds: function (selector) {
            var ids = [];
            $('#todo-list').find('li').each(function (index, element) {
                var taskElement = $(element);
                if (selector(taskElement)) {
                    ids.push(taskElement.data('id'));
                }
            });
            return ids;
        }

    };
    App.init();
});