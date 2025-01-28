// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  //If AssignmentGroup does not belong to course Id your program should thorugh an error
  //Below function will validate if AssignmentGroup belongs to courseId
  function validateCourseId(course,assignment)
  {
    if(course.id!==assignment.course_id)
    {
        throw new Error(`Invalid data :Assignment group with course Id ${assignment.course_id} does not belong to Course Id ${course.id}. Please correct`)
    }
  }
  //The below function validates data like points possible
  function validateData(assignmentObj)
  {
    //Check if points_possible is 0 you cannot divide by 0
    assignmentObj.assignments.forEach(assignment => {
        if(assignment.points_possible===0 || !Number(assignment.points_possible))
        {
            throw new Error(`Invalid Data: Assignment with Id ${assignment.id} has 0 possible points.Please correct.`)

        }
        else if(!assignment.due_at && Date(assignment.due_at)) //check if assignment due date is set 
        {
            throw new Error(`Invalid Data: Assignment with Id ${assignment.id} has invalid due date.Please correct.`)

        }
    });

  }

  //Exclude assignments from calculations that are not due yet
  function filterAssignments(assignments)
  {
    //Store Valid assignments in new Array 
    
    const validAssignments=assignments.filter((assignment)=>new Date(assignment.due_at)<=new Date());
    return validAssignments;
 
  }
  //the below function calculates average 
  function calculateAssignmentScores(submissions, assignments) {
    const scores = {}; // to store each score
    //For Each assignment check if submissions assignment Id matches assignments group ID
    assignments.forEach(assignment => {
      let submission = null;
  
      // loop through submissions to find the matching 
      for (let i = 0; i < submissions.length; i++) {
        if (submissions[i].assignment_id === assignment.id) {
          submission = submissions[i];
          break; // exit the loop once we find the match
        }
      }
  
      // If a matching submission is found then we can calculate the score
      if (submission) {
        let score = submission.submission.score;
        if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at)) {
          score -= assignment.points_possible * 0.1; // Deduct 10% for late submissions
        }
  
        // Add the score (in percentage) to the scores object
      
        scores[assignment.id]=(score / assignment.points_possible) * 100; //Multiplying by 100 to get the percentage
        //console.log(scores)

      }
    });
    // //Return the score object 
    return scores;
  }
  
  //Calculate weighted percentage 
  function calculateWeightedPercentage(scores,assignments)
  {
    let totalPoints=0;  //This will hold total points possible from assignment
    let weightedScore=0; //This will get the weighted score
    let average=0
    assignments.forEach(assignment=>
    {
      
        if(scores[assignment.id]!==undefined)
        {
            totalPoints+=assignment.points_possible; //sum up all the points possible 
            //console.log("Total Points",totalPoints);
            weightedScore += (scores[assignment.id]/100)*assignment.points_possible ;
            //console.log(weightedScore)
        }
        else
        {
          throw new error("No matching submitted assignments found with assignment group assignments Id");
        }
    });
    //This will give percentage
    average=((weightedScore / totalPoints)* 100)
  
    return average;
  }

  

  function getLearnerData(course, ag, submissions) {
    // here, we would process this data to achieve the desired result.
    let result=[]
    //Validate If course Id is present ub assignment group
    validateCourseId(course,ag);
    //Validates null data
    validateData(ag)
    //Validate Assignments 
    const validAssignments=filterAssignments(ag.assignments)
    console.log(validAssignments)
    const learners = {};
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      
      if (!learners[submission.learner_id]) {
        learners[submission.learner_id] = { id: submission.learner_id, scores: {} };
      }
      
      learners[submission.learner_id].scores = calculateAssignmentScores(
        submissions.filter(sub => sub.learner_id === submission.learner_id),
        validAssignments
      );
    }
    //console.log(learners);
    //Call final function calculateWeightedPercentage to get results which includes average
    try
    {
        const results=[] //This will hold results
        for(const learner of Object.values(learners))
        {
            const learnerscores=learner.scores;
            //console.log("Scores",learnerscores)
            const average=calculateWeightedPercentage(learnerscores,validAssignments);
            //console.log("Average",average)
        
        results.push({
            id: learner.id,
            avg: average,
            ...learnerscores // Spread the learner's scores into the object
          });
        }
        return results;
        
       }
       catch (error) {
        console.error(`Error processing data: ${error.message}`);
        return []; // Return an empty array in case of error
     }
  }
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  console.log(result);

