(function () {
    var lda = require('lda');

    // Example document.
    var text = 'Do we have Memorial Day off?' + 'Is the office closed on Monday?' + 
    'Is the office closed on Memorial Day?' +
    'Does anyone know whether we have Memorial Day off?' +
    'When is Memorial Day?' +
    'Hey does anyone know off the top of their head if we get Memorial Day off of work?' +
    'who do I talk about jenkins?' +
    'who can help with CI?' +
    'where do I go to about IOT?' +
    'who can answer questions related to legalese?' +
    'What is the 401K policy?' +
    'What is Uptake\'s holiday schedule?' +
    'Who do I talk with about a lost badge?' +
    'Do we have ____ Day off? (Polasky, Good Friday, Martin Luther King, etc.' +
    'When is Bring Your Kids to Work Day?';

    var noOfTopics = 3;
    var noOfTerms = 10;

    // Extract sentences.
    var documents = text.match( /[^\.!\?]+[\.!\?]+/g );

    // Run LDA to get terms for 2 topics (5 terms each).
    var topics = lda(documents, noOfTopics, noOfTerms);
    var questionAsked = 'When is memorial day?'.replace(/\?/g, '');

    function getMostMatchedTopis(question) {
        var mostMatchedTopis = [];
        var topicWeights = [];

        for (var topicIndex = 0; topicIndex < noOfTopics; topicIndex++) {
            var topic = topics[topicIndex];
            console.log('topic', topic);
            var termObj = {};
            for (var termIndex = 0; termIndex < noOfTerms; termIndex++) {
                termObj[topic[termIndex].term] = topic[termIndex].probability;
            }

            var words = question.split(' ');
            var weight = 0;
            for (var wordsIndex = 0; wordsIndex < words.length; wordsIndex++) {
                weight+= (termObj[words[wordsIndex]] || 0)
            }
            topicWeights[topicIndex] = weight;
            console.log('weight: ', weight);
        }

        var maxWeight = topicWeights[0];
        for (var topicIndex = 1; topicIndex < noOfTopics; topicIndex++) {
            if (maxWeight < topicWeights[topicIndex]) {
                maxWeight = topicWeights[topicIndex];
            }
        }
        console.log('maxWeight: ', maxWeight);

        for (var topicIndex = 0; topicIndex < noOfTopics; topicIndex++) {
            if (maxWeight == topicWeights[topicIndex]) {
                mostMatchedTopis.push(topicIndex);
            }
        }

        return mostMatchedTopis;
    }

    var mostMatchedTopics = getMostMatchedTopis(questionAsked);
    console.log('Question: ', questionAsked);
    console.log('mostMatchedTopics');
    for (var topicIndex = 0; topicIndex < mostMatchedTopics.length; topicIndex++) {
        console.log(topics[mostMatchedTopics[topicIndex]]);
    }
})();