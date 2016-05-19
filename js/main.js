/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var urlRoot = "https://go.votomobile.org/api/v1/surveys/"; //global variable for the root url

$(document).ready(function () {
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(retrieveResults);

});
/**
 * function to call the filter function 
 * @param {type} number
 * @returns {undefined}
 */
function diplayFilter(number){
    filterResults(number);
  
}



/**
 * function to make an xhtmlRequest to call the 
 * @param {type} u
 * @returns {Object|Array}functipon to connect with VOTO server 
 * 
 */
function sendRequest(u) {

    console.log(u);
    var obj = $.ajax({url: u, async: false});
    var result = $.parseJSON(obj.responseText);
    return result;
}


/**
 * function to visually disply the 
 * @returns {undefined}
 */
function retrieveResults() {
    var url = urlRoot + "207314/results?api_key=abc2ef1cdc1f6948c517902be";
    var object = sendRequest(url);
    var questionTitle ="";
    /*
     * if the results are available
     */
    if (object.code === 1000) {
        var list;
        $.each(object.data.results, function (i, results) {
           
            var questionNumber = results.question_number;
            questionTitle = results.question_title
            /*
             * if the the response type is multiple choice 
             */
            if (results.response_type == 1) {
                var nameArray = [];
                var percentageArray = [];
                var numberOfRespondentArray = []


                /*
                 * loop to group the multiple choice option reponses 
                 */
                $.each(results.choice_responses, function (k, choices) {
                    var name = choices.name;
                    var percentage = choices.percentage;
                    var responses = choices.num_responses;

                    nameArray [k] = name;
                    percentageArray[k] = percentage;
                    numberOfRespondentArray[k] = responses;
                });
                
               /*
                * group the data values to display on the google chart
                * @type google.visualization.DataTable
                */
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'nameArray');
                data.addColumn('number', 'percentageArray');

                /**
                 * display the piehole of each multiple choice question
                 * @type Number
                 */
                for (var j = 0; j < nameArray.length; j++) {
                    data.addRow([nameArray[j], percentageArray[j]]);
                    var options = {
                        title: questionTitle,
                        pieHole: 0.4,
                    };
                    var tableContentElement = "tableContent" + questionNumber
                    var tableContent = '<tr><td><b>' + nameArray[j] + '</b><td>' + percentageArray[j] + '</td><td>' + numberOfRespondentArray[j] + '</td></tr>';
                    $('#' + tableContentElement + '').append(tableContent); //append the results of each multiple choice on a table 
                    var questionElementId = "question" + questionNumber;
                    var chart = new google.visualization.PieChart(document.getElementById(questionElementId));
                    chart.draw(data, options); //draw the chart
                }
            }
            else if (results.response_type == 2) { //display the numeric questions
                var totalResponse = results.total_responses;
                var averageAge = results.response_average;
                var stdDeviation = results.response_std;
                var maxMumAge = results.response_max;
                var minimumAge = results.response_min;
                list = '<tr><td>' + totalResponse + '</td><td>' + averageAge + '</td><td>' + stdDeviation + '</td><td>' + maxMumAge + '</td><td>' + minimumAge + '</td></tr>';
                $("#tableBody").html(list);
            }
            else {

            }
        });
    }
    else {
        throw new Error('CORS NOT SUPPORTED');
    }
}

/**
 * function to cross tabulate the data given two inputs
 * @returns {undefined}
 */
function crossTabulation() {
    var choice1 = $("#choice1").val();
    var choice2 = $("#choice2").val();

    var url = urlRoot + "207314/results?api_key=abc2ef1cdc1f6948c517902be";
    var object = sendRequest(url);
    /*
     * if the url posts results
     */
    if (object.code == 1000) {
        if (choice1 == 1) {
            if (choice2 == 1) {
                alert("Select another choice other than Question" + choice2);
            }
            if (choice2 == 2) {
                alert(choice1 + " " + choice2);
                $.each(object.data.results, function (i, results) {
                    if (results.question_number == choice1) {
                        var questionNumber = results.question_number;
                        var questionTitle = results.question_title;

                        var choice1ArrayName = []; //arra to hold name values
                        $.each(results.choice_responses, function (j, choice1Names) {
                            choice1ArrayName[j] = choice1Names.name;
                            alert(choice1ArrayName[j]);
                        });
                        var thead = ' ';
                        for (var k = 0; k < choice1ArrayName.length; k++) {
                            thead += '<th>' + choice1ArrayName[k] + '</th>';
                        }
                        var header = '<tr>' + '<td>' + questionNumber + '. ' + questionTitle + '</td>' + thead + '</tr>';
                        $("#tableHeader").html(header);
                    }
                });
            }
            else if (choice2 == 4) {
                alert(choice1 + " " + choice2);
            }
            else if (choice2 == 5) {
                alert(choice1 + " " + choice2);
            }
            else if (choice2 == 6) {
                alert(choice1 + " " + choice2);
            }

        }
        else if (choice1 == 2) {
            if (choice2 == 1) {

            }
            else if (choice2 == 4) {

            }
            else if (choice2 == 5) {

            }
            else if (choice2 == 6) {

            }
        }
        else if (choice1 == 4) {
            if (choice2 == 2) {

            }
            else if (choice2 == 1) {

            }
            else if (choice2 == 5) {

            }
            else if (choice2 == 6) {

            }
        }
        else if (choice1 == 5) {
            if (choice2 == 2) {

            }
            else if (choice2 == 4) {

            }
            else if (choice2 == 1) {

            }
            else if (choice2 == 6) {

            }
        }
        else if (choice1 == 6) {
            if (choice2 == 2) {

            }
            else if (choice2 == 4) {

            }
            else if (choice2 == 5) {

            }
            else if (choice2 == 1) {

            }
        }
    }

}

/**
 * function to filter by user selection
 * @param {type} number
 * @returns {undefined}
 */
function filterResults(number) {
  
   var valueToFilter = $('#selectNameOptions').val();
   
    var questionNumberValue = $("#selectQuestionOtion").val();
 
    var urlResults = urlRoot + "207314/results?api_key=abc2ef1cdc1f6948c517902be";
    var objectResults = sendRequest(urlResults);
  
    var questionId1 = "";
    var questionId2 = "";
    var subscriberId = [];
    /*
     * this block executes the rest of filtering function if the url yields results 
     */
    if (objectResults.code == 1000) {
        $.each(objectResults.data.results, function (i, results) {
            if (results.question_number == number) {
                questionId1 = results.question_id;
            
            }
            if (results.question_number == questionNumberValue) {
                questionId2 = results.question_id;
              

            }
           
        });
        
        /*
         * find the subscibers by that have the filter name
         */
        var urlQuestions = urlRoot + "207314/questions/" + questionId2 + "/results?api_key=abc2ef1cdc1f6948c517902be";
        var objectQuestion = sendRequest(urlQuestions);
        if (objectQuestion.code == 1000) {
            var count=0;
            $.each(objectQuestion.data.responses, function (j, responses) {
                if (responses.choice_name == valueToFilter) {             
                        subscriberId[count] = responses.subscriber.id;
                    count++;
                }
            });

            /*
             * Use the filter to search for their occurance in the qu=iven question
             */
            var urlFinalFilter = urlRoot + "207314/questions/" + questionId1 + "/results?api_key=abc2ef1cdc1f6948c517902be";
            var objectFilter = sendRequest(urlFinalFilter);
            var choiceMade = [];
            var choice1 = [];
            var numberOfOccurrance = [];
            var questionTitle = "";
            if (objectFilter.code == 1000) {

                questionTitle = objectFilter.data.question.title;
                var countSub = 0;
                $.each(objectFilter.data.responses, function (m, responses) {
                        if (subscriberId[countSub] == responses.subscriber.id) {
                            choiceMade[countSub] = responses.choice_name;
                              countSub++;
                        }
                });

                var option1 = choiceMade[0];
                var count1 = 0;
                var occurance = 1;
                choice1[count1] = option1;
                
                /*
                 * group the results of each option into the number of occurance and the options
                 * @type Number
                 */
                for (var t = 0; t < choiceMade.length; t++) {
                    if (choiceMade[t] != option1) {
                        option1 = choiceMade[t];
                        count1++;
                        choice1[count1] = choiceMade[t];
                        occurance = 1;
                        numberOfOccurrance[count1] = occurance;
                    }
                    else {
                        numberOfOccurrance[count1] = occurance;
                        occurance++;
                    }
                }
               
              
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'choice1');
                data.addColumn('number', 'numberOfOccurrance');
                
                for (var j = 0; j < choice1.length; j++) {
                    data.addRow([choice1[j], numberOfOccurrance[j]]);   
                    var options = {
                        title: questionTitle,
                        pieHole: 0.4,
                    };
                  
                    var chart = new google.visualization.PieChart(document.getElementById("question1Analysis"));
                    chart.draw(data, options); //draw the chart
                }
            }

        }
    }
}


/**
 * function to find group each multiple question choice 
 * @returns {undefined}
 */
function fetchNames() {
    var question1NamesArray = [];
    var question2NamesArray = [];
    var question4NamesArray = [];
    var question5NamesArray = [];
    var question6NamesArray = [];
    var questionTitle1 ="";
    var questionTitle2 ="";
    var questionTitle4 ="";
    var questionTitle5 ="";
    var questionTitle6 ="";
    var urlFetchNames = urlRoot + "207314/questions?api_key=abc2ef1cdc1f6948c517902be";
    var objectFetchResults = sendRequest(urlFetchNames);

    if (objectFetchResults.code == 1000) {
        $.each(objectFetchResults.data.questions, function (i, questions) {
            if (questions.response_type == 1 && questions.question_number == 1) {
                $.each(questions.options, function (j, options1) {
                    question1NamesArray[j] = options1;
                });
                questionTitle1 = questions.title;
            }
            if (questions.response_type == 1 && questions.question_number == 2) {
                $.each(questions.options, function (j, options1) {
                    question2NamesArray[j] = options1;
                });
                 questionTitle2 = questions.title;
            }
            if (questions.response_type == 1 && questions.question_number == 4) {
                $.each(questions.options, function (j, options1) {
                    question4NamesArray[j] = options1;
                });
                 questionTitle4 = questions.title;
            }
            if (questions.response_type == 1 && questions.question_number == 5) {
                $.each(questions.options, function (j, options1) {
                    question5NamesArray[j] = options1;
                });
                 questionTitle5 = questions.title;
            }
            if (questions.response_type == 1 && questions.question_number == 6) {
                $.each(questions.options, function (j, options1) {
                    question6NamesArray[j] = options1;
                });
                 questionTitle6 = questions.title;
            }

        });
    }
    var selectedOption = $("#selectQuestionOtion").val();
    if (selectedOption == 1) {
        $("#selectedQuestion").html("Question: "+questionTitle1);
        var optionChoice = ' ';
        for (var n = 0; n < question1NamesArray.length; n++) {
            optionChoice += '<option value="' + question1NamesArray[n] + '">' + question1NamesArray[n] + '</option>';

        }
        $("#selectNameOptions").html(optionChoice);
    }
    else if (selectedOption == 2) {
        $("#selectedQuestion").html("Question: "+questionTitle2);
        var optionChoice = ' ';
        for (var n = 0; n < question2NamesArray.length; n++) {
            optionChoice += '<option value="' + question2NamesArray[n] + '">' + question2NamesArray[n] + '</option>';

        }
        $("#selectNameOptions").html(optionChoice);
    }
    else if (selectedOption == 4) {
         $("#selectedQuestion").html("Question: "+questionTitle4);
        var optionChoice = ' ';
        for (var n = 0; n < question4NamesArray.length; n++) {
            optionChoice += '<option value="' + question4NamesArray[n] + '">' + question4NamesArray[n] + '</option>';

        }
        $("#selectNameOptions").html(optionChoice);
    }
    else if (selectedOption == 5) {
         $("#selectedQuestion").html("Question: "+questionTitle5);
        var optionChoice = ' ';
        for (var n = 0; n < question5NamesArray.length; n++) {
            optionChoice += '<option value="' + question5NamesArray[n] + '">' + question5NamesArray[n] + '</option>';

        }
        $("#selectNameOptions").html(optionChoice);
    }
    else if (selectedOption == 6) {
        $("#selectedQuestion").html("Question: "+questionTitle6);
        var optionChoice = ' ';
        for (var n = 0; n < question6NamesArray.length; n++) {
            optionChoice += '<option value="' + question6NamesArray[n] + '">' + question6NamesArray[n] + '</option>';
        }
        $("#selectNameOptions").html(optionChoice);
    }
}