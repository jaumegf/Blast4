/*
	Knockout ViewModel binding sample with array
	To check KnockOut documentation visit: http://knockoutjs.com/documentation/introduction.html
	Sample focuses on array binding,check documentation. http://knockoutjs.com/documentation/foreach-binding.html
 */

window.board = new Board();

//The View Model class
function KnockoutViewModel() {
    var self = this;

    self.setControllerMode = function (_IAppController) { currentController = _IAppController; }
    self.getControllerMode = function () { return currentController; };

	//Define observable properties
	//The board: It's an array
    self.board = ko.observableArray(board.newBoard());

	//Label to winner text
    self.winner = ko.observable();
	//We use Ko.computed as a readonly property
    //self.playAgainVisible = ko.computed(function () { return (self.winner()!=null); }, self);

	//self.board() it's a binding property
	//To get the array model we need to map it by using utils arrayMap
    self.getDashboard = function () {
        var dashboard = ko.utils.arrayMap(self.board(), function (item) {
            return ({
                index: item.index
                , cols: ko.utils.arrayMap(item.cols, function (item) {
                    return (item);
                })
            });
        });


        return (dashboard);
    };


	//Method userThrow. Called whe user click the button of column
    self.userThrow = function (column) {
        self.getControllerMode().userThrow(column);
    }


    //Throw enabled property to enable/disable column throw
    self.throwEnabled = function (column) {
        if (self.winner() != null) return (false);

        for (var i = 0; i <= (self.getDashboard().length - 1) ; i++) {
            if (self.getDashboard()[i].cols[column] == null) {
                return (true);
            }
        }

        return (false);
    };
}
