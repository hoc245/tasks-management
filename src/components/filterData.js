let monthFilter = [
    {
      id : "month01",
      name : "January"
    },
    {
      id : "month02",
      name : "February"
    },
    {
      id : "month03",
      name : "Match"
    },
    {
      id : "month04",
      name : "April"
    },
    {
      id : "month05",
      name : "May"
    },
    {
      id : "month06",
      name : "Jun"
    },
    {
      id : "month07",
      name : "July"
    },
    {
      id : "month08",
      name : "August"
    },
    {
      id : "month09",
      name : "September"
    },
    {
      id : "month10",
      name : "October"
    },
    {
      id : "month11",
      name : "November"
    },
    {
      id : "month12",
      name : "December"
    },
  ]
let stateFilter = [
{
    id : "state01",
    name : "Waiting"
},
{
    id : "state02",
    name : "To-do"
},
{
    id : "state03",
    name : "Doing"
},
{
    id : "state04",
    name : "Feedback"
},
{
    id : "state05",
    name : "Done"
},
{
    id : "state06",
    name : "Pending"
},
{
    id : "state07",
    name : "Cancel"
},
]

export function getMonthFilter() {
    return monthFilter;
}
export function getStateFilter() {
    return stateFilter;
}