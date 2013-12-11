$(function () {
    'use strict';

    var App = {
        init: function () {
            this.ENTER_KEY = 13;
            this.cacheElements();
            this.bindEvents();
            this.render();
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
            this.$count = this.$footer.find('#todo-count');
            this.$clearBtn = this.$footer.find('#clear-completed');
        },
        bindEvents: function () {
            this.$newTodo.on('keyup', this.createTaskItem);
            this.$footer.on('click', '#clear-completed', this.destroyCompleted);
            var list = this.$todoList;
            list.on('click', '.destroy', this.deleteTaskItem);
            list.on('change', '.toggle', this.toggle);
            list.on('dblclick', 'label', this.edit);
            list.on('keypress', '.edit', this.blurOnEnter);
            list.on('blur', '.edit', this.update);
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
        render: function () {
            this.displayTodos();
        },
        createTaskItem: function (e) {
            var input_field = $(this);
            var new_todo_task = $.trim(input_field.val());
            if (e.which !== App.ENTER_KEY || !new_todo_task) {
                return
            }
            input_field.val('');
            socket.post('/tasks', {title: new_todo_task, completed: false}, function (response) {
                App.render();
            });
        },
        deleteTaskItem: function () {
            socket.delete('/tasks/' + App.getCurrentId(), function (response) {
                App.render();
            });
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
                activeTodoWord: "todo",//Utils.pluralize(uncompletedTodoCount, 'item'),
                completedTodos: todoCount - uncompletedTodoCount
            };

            this.$footer.toggle(!!todoCount);
            this.$footer.html(this.footerTemplate(footer));
        },
        destroyCompleted: function () {
            App.todoList().find('li').each(function (index, element) {
                var selectBox = $(element).find(':checkbox');
                if (selectBox.is(':checked')) {
                    socket.delete('/tasks/' + App.getId(element), function (response) {
                        App.render();
                    });
                }
            });
        },
        toggle: function () {
            socket.put('/tasks/' + App.getCurrentId(), {completed: !!this.checked}, function (response) {
                App.render();
            });
        },
        toggleAll: function () {
            var isChecked = $(this).prop('checked');
            App.todoList().find('li').each(function (index, element) {
                socket.put('/tasks/' + App.getId(element), {completed: isChecked}, function (response) {
                    App.render();
                });
            });
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
        update: function () {
            var val = $.trim($(this).removeClass('editing').val());
            socket.put('/tasks/' + App.getCurrentId(), {title: val}, function (response) {
                App.render();
            });
        },
        todoList: function() {
            return $('#todo-list');
        },
        getCurrentId: function() {
            return $(this).closest('li').data('id');
        },
        getId: function(element) {
            return $(element).data('id');
        }

    };
    App.init();
});