/**
 * TasksController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var TasksController = {

    completed: function (req, res) {
        var newCompletedValue = req.body.completed
        var taskIds = req.body.ids;
        Tasks.update({"id": taskIds}, {"completed": newCompletedValue}, function (error, tasks) {
            if (error) console.error(error);
        });
        res.json({success: true});
    },
    delete_completed: function (req, res) {
        var taskIds = req.body.ids;
        Tasks.destroy({"id": taskIds}, function (error, tasks) {
            if (error) console.error(error);
        });
        res.json({success: true});
    }
};
module.exports = TasksController;

