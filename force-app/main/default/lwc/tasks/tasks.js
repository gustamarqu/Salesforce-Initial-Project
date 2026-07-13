import { LightningElement } from 'lwc';

export default class Tasks extends LightningElement {
  tasknova = '';
  filterStatus = "all";

  tasks = [
    {
      id: 1,
      toDo: "Call Client",
      done: false
    },
    {
      id: 2,
      toDo: "Meet Client",
      done: true
    },
    {
      id: 3,
      toDo: "Send Proposal",
      done: false
    },
    {
      id: 4,
      toDo: "Review Contract",
      done: false
    },
    {
      id: 5,
      toDo: "Update CRM",
      done: true
    },
    {
      id: 6,
      toDo: "Schedule Follow-up",
      done: false
    },
    {
      id: 7,
      toDo: "Prepare Demo",
      done: true
    },
    {
      id: 8,
      toDo: "Check Client Feedback",
      done: false
    }
  ];

  removerTask(event) {
    const idTask = Number(event.currentTarget.dataset.id);

    this.tasks = this.tasks.filter(task => task.id !== idTask);
  }

  novaTask(event) {
    this.tasknova = event.target.value;
  }

  addTask() {
    if (!this.tasknova) {
      return;
    }

    const tasknovinha = {
      id: Date.now(),
      toDo: this.tasknova,
      done: false
    };

    this.tasks = [...this.tasks, tasknovinha];

    this.tasknova = '';
  }

  filtered(event) {
    this.filterStatus = event.target.value;
  }

  get filteredTasks() {
    if (this.filterStatus === "true") {
      return this.tasks.filter(task => task.done === true);
    }

    if (this.filterStatus === "false") {
      return this.tasks.filter(task => task.done === false);
    }

    return this.tasks;
  }

  get hasNoTasks() {
    return this.filteredTasks.length === 0;
  }

  mudarStatus(event) {
    const taskid = Number(event.currentTarget.dataset.id);
    const statusvalue = event.target.checked;

    this.tasks = this.tasks.map(task => {
      if (task.id === taskid) {
        return {
          ...task,
          done: statusvalue
        };
      }

      return task;
    });
  }
}