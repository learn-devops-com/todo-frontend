import * as React from "react";

class TodoList extends React.Component {
  render () {
    var items = this.props.items.map((item, index) => {
      return (
          <TodoListItem key={index} item={item} index={index} removeItem={this.props.removeItem} markTodoDone={this.props.markTodoDone} />
      );
    });
    return (
        <ul className="list-group"> {items} </ul>
    );
  }
}

class TodoListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
  }
  onClickClose() {
    var index = parseInt(this.props.index);
    this.props.removeItem(index);
  }
  onClickDone() {
    var index = parseInt(this.props.index);
    this.props.markTodoDone(index);
  }
  render () {
    var todoClass = this.props.item.done ?
        "done" : "undone";
    return(
        <li className="list-group-item ">
          <div className={todoClass}>
            <span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={this.onClickDone}></span>
            {this.props.item.title}
            <button type="button" className="close" onClick={this.onClickClose}>&times;</button>
          </div>
        </li>
    );
  }
}

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.refs.itemName.focus();
  }
  onSubmit(event) {
    event.preventDefault();
    var newItemValue = this.refs.itemName.value;

    if(newItemValue) {
      this.props.addItem({newItemValue});
      this.refs.form.reset();
    }
  }
  render () {
    return (
        <form ref="form" onSubmit={this.onSubmit} className="form-inline">
          <input type="text" ref="itemName" className="form-control" placeholder="add a new todo..."/>
          <button type="submit" className="btn btn-default">Add</button>
        </form>
    );
  }
}

class TodoHeader extends React.Component {
  render () {
    return <h1>Todo list</h1>;
  }
}

class TodoApp extends React.Component {
  constructor (props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.markTodoDone = this.markTodoDone.bind(this);
    this.state = {todoItems: []};
  }

  componentDidMount = async () => {
    const response = await fetch('http://localhost:4000/todos');

    if(response.ok) {
      response.json().then((todoItems) => {
        this.setState({
          todoItems
        })
      });
    }
  };

  addItem(todoItem) {
    this.todoItems.unshift({
      index: this.todoItems.length+1,
      value: todoItem.newItemValue,
      done: false
    });
    this.setState({todoItems: this.todoItems});
  }
  removeItem (itemIndex) {
    this.todoItems.splice(itemIndex, 1);
    this.setState({todoItems: this.todoItems});
  }
  markTodoDone(itemIndex) {
    var todo = this.todoItems[itemIndex];
    this.todoItems.splice(itemIndex, 1);
    todo.done = !todo.done;
    todo.done ? this.todoItems.push(todo) : this.todoItems.unshift(todo);
    this.setState({todoItems: this.todoItems});
  }
  render() {
    return (
        <div id="main">
          <TodoHeader />
          <TodoList items={this.state.todoItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone}/>
          <TodoForm addItem={this.addItem} />
        </div>
    );
  }
}

export default TodoApp;
