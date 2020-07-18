//Budget Controller
var budgetController = (function(){

	var Expense=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
		this.percentage=-1;
	};

	var Income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};
	Expense.prototype.calcPercentage=function(totalIncome){
		if(totalIncome>0){
		this.percentage=Math.round((this.value/totalIncome)*100);
		}else{
			percentage=-1;
		}
	};
	Expense.prototype.getPercentage=function(){
		return this.percentage;
	}

	// var calculateTotal= function(type){
	// 	var sum=0;
	// 	data.allItem[type].forEach(function(cur){
	// 		sum+=cur.value;
	// 	});
	// 	data.totals[type]=sum;
	// };
	    var calculateTotal = function(type) {
        var sum = 0;
        data.allItem[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    

	var data= {
		allItem:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage:-1
	};
	return {
		addItem: function(type,des,val){
			var newItem,ID;
			if(data.allItem[type].length>0){
			ID= (data.allItem[type][data.allItem[type].length -1].id+1);
			}else{
				ID=0;
			}

			if(type==='inc'){
				newItem=new Income(ID,des,val);
			}else if(type==='exp'){
				newItem=new Expense(ID,des,val);
			}
			data.allItem[type].push(newItem);
			return newItem;
		},

			deleteItem:function(type,id){
				var ids,index;
				ids=data.allItem[type].map(function(current){
					return current.id;
				});
				index=ids.indexOf(id);
				if(index!== -1){
					data.allItem[type].splice(index,1);
				}
			},
		        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }    

		},
		calculatePercentages: function(){
			data.allItem.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});
		},
		getPercentage: function(){
			var allPercentage=data.allItem.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPercentage;
		},
		getBudget: function(){
			return{
				budget:data.budget,
				totalInc:data.totals.inc,
			 	totalExp:data.totals.exp,
			 	percentage:data.percentage
			};
		}
	};


})();

//UI controler
var UIController=(function(){

	var getDOMstrings={
		inputType:'.add__type',
		inputDescription:'.add__description',
		inputValue:'.add__value',
		inputBtn:'.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list',
		budgetLabel:'.budget__value',
		incomeLabel:'.budget__income--value',
		expenseLabel:'.budget__expenses--value',
		percentageLabel:'.budget__expenses--percentage',
		container:'.container',
		expenseLabelPercentages:'.item__percentage',
		dateLabel:'.budget__title--month'
		};
					var formatNumber=function(num,type){
			 	var numSplit;
			 	//+ or - before th no. exactly to decimal point and comma seperating
			 	num=Math.abs(num);
			 	num=num.toFixed(2);
			 	numSplit=num.split('.');
			 	int=numSplit[0];

			 	if(int.length>3){
			 		int=int.substr(0,int.length-3)+ ','+ int.substr(int.length-3,3);
			 	}


			 	dec=numSplit[1];

			 
			 	return  	(type==='exp' ? '-': '+') +' '+ int + '.'+dec;
			 };

			 			 	var nodeListForEach=function(list,callBack){
			 		for(var i=0;i< list.length;i++){
			 			callBack(list[i],i);
			 		}
			 	};


	return {
		getInput: function(){

			return{
			 type: document.querySelector(getDOMstrings.inputType).value,//either inc or exp
			 description : document.querySelector(getDOMstrings.inputDescription).value,
			 value:parseFloat(document.querySelector(getDOMstrings.inputValue).value)
			};
		 },

		 addListItem: function(obj,type){
		 	var Html,newHtml,element;
		 	//create html string with placeholder
		 	if(type==='inc'){
		 		element=getDOMstrings.incomeContainer;
           Html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
		 	}else if(type==='exp'){
		 		element=getDOMstrings.expenseContainer;
           Html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
		
			//replace place holder with actual data
			newHtml= Html.replace('%id%',obj.id);
			newHtml= newHtml.replace('%description%',obj.description);
			newHtml= newHtml.replace('%value%',formatNumber(obj.value,type));

			//insert the html the DOM
			   document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
			 },

			 deleteListItem:function(selectorID){
			 	var el=document.getElementById(selectorID);
			 	el.parentNode.removeChild(el);

			 },

			 clearFields:function(){
			 var fields,fieldsArr;
			 fields= document.querySelectorAll(getDOMstrings.inputDescription+ ','+ getDOMstrings.inputValue);	
			 
			 fieldsArr=Array.prototype.slice.call(fields);

			 fieldsArr.forEach(function(current,index,array){
			 	current.value="";
			 });
			 fieldsArr[0].focus();
			},

			 
    			 displayBudget: function(obj){
			 	var type;
			 	obj.budget >0 ? type='inc': type='exp';
			 	document.querySelector(getDOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
			 	document.querySelector(getDOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
			 	document.querySelector(getDOMstrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');

			 	if(obj.percentage>0){
			 	document.querySelector(getDOMstrings.percentageLabel).textContent=obj.percentage +'%';			 		
			 }else{
			    document.querySelector(getDOMstrings.percentageLabel).textContent='---';
			 }
			 },
			 displayPercentages: function(percentages){
			 	var fields =document.querySelectorAll(getDOMstrings.expenseLabelPercentages);

			 	
			 	nodeListForEach(fields,function(current,index){
			 		if(percentages[index]>0){
			 		current.textContent=percentages[index]+'%';
			 		}else{
			 			current.textContent='---';
			 		}
			 	});
			 },
			 displayMonth: function(){
			 	var year,now,months;
			 	now= new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			 	month=now.getMonth();
			 	year =now.getFullYear();
			 	document.querySelector(getDOMstrings.dateLabel).textContent=months[month] +' '+year;
			 },
			 changedType:function(){
			 	var fields=document.querySelectorAll(
			 		getDOMstrings.inputType+','+
			 		getDOMstrings.inputDescription+','+
			 		getDOMstrings.inputValue);

			 	nodeListForEach(fields,function(current){
			 		current.classList.toggle('red-focus');
			 	});
			 	document.querySelector(getDOMstrings.inputBtn).classList.toggle('red');
			 		
			 },

		DOMstrings: function() {
			return (getDOMstrings);
		}

	};


})();

//Global App Controller
var controller=(function(budgetCtrl,UICtrl){
 	
	var setupEventListener=function(){
 	var DOM=UICtrl.DOMstrings();
	document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

	document.addEventListener('keypress',function(event){
	if(event.keyCode===13){
		ctrlAddItem();
	   };
	});
	document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
};
	var updatePercentages=function(){
		//calculate percentage
		budgetCtrl.calculatePercentages();

		//read percentage from budget controler
		var percentages=budgetCtrl.getPercentage();

		//update user interface
		UICtrl.displayPercentages(percentages);
	};

var updateBudget=function(){
	
	//calculate the budget
	budgetCtrl.calculateBudget();

	//return the budget
	var budget=budgetCtrl.getBudget();

	//display budget in UI
	UICtrl.displayBudget(budget);
};

var ctrlDeleteItem=function(event){
	var itemID , type,ID;
     itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
     if(itemID){
     	splitID=itemID.split('-');
     	type=splitID[0];
     	ID= parseInt(splitID[1]);

     	//delete item from data structure
     	budgetCtrl.deleteItem(type,ID);

     	//delete item from UI
     	UICtrl.deleteListItem(itemID);

     	//update and show new budget
        updateBudget();		
        //update percentage
        updatePercentages();

     }
};
 	

var ctrlAddItem=function(){
	//get input
	var input=UICtrl.getInput();
	if(input.description!=="" && !isNaN(input.value)&& input.value>0){
	//add item to budge controller
	var newItem =	budgetController.addItem(input.type,input.description,input.value);
	//add item to UI
	UICtrl.addListItem(newItem,input.type);
	//clear the fields
	UICtrl.clearFields();
	//calculate and update budget
	updateBudget();		
        updatePercentages();
	}
};

return {
	init: function(){
		console.log('started');
		UICtrl.displayMonth();
		UICtrl.displayBudget({
				budget:0,
				totalInc:0,
			 	totalExp:0,
			 	percentage:-1
			});
		setupEventListener();
	}
};

})(budgetController,UIController);

controller.init();