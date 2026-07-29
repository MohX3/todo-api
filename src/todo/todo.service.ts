import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {   }

  async create(createTodoDto: CreateTodoDto) {
    const existingTodo = await this.todoRepository.createQueryBuilder('todo')
      .where('LOWER(todo.title) = LOWER(:title)', { title: createTodoDto.title }).getOne();
    if (existingTodo) 
    {
      throw new BadRequestException('Todo title must be unique!');
    }
    const newTodo = this.todoRepository.create(createTodoDto);
    return await this.todoRepository.save(newTodo);
  }

  async findAll(query: any) {

    let page = 1;
    if (query.page) {
      page = parseInt(query.page);
    }
    let limit = 10;
    if (query.limit) {
      limit = parseInt(query.limit);
    }
    let skipAmount = (page - 1) * limit;
    let queryBuilder = this.todoRepository.createQueryBuilder('todo');

    
    if (query.search) 
    {
      let searchTerm = query.search.toLowerCase();
      queryBuilder.andWhere('LOWER(todo.title) LIKE :search', { search: '%' + searchTerm + '%' });
    }
    if (query.completed === 'true') 
    {
      queryBuilder.andWhere('todo.completed = :completed', { completed: true });
    } 
    else if (query.completed === 'false') 
    {
      queryBuilder.andWhere('todo.completed = :completed', { completed: false });
    }
    if (query.sort === 'title') 
    {
      if (query.order === 'desc') 
      {
        queryBuilder.orderBy('todo.title', 'DESC');
      } 
      else 
      {
        queryBuilder.orderBy('todo.title', 'ASC');
      }
    } 
    else 
    {
      if (query.order === 'asc') 
      {
        queryBuilder.orderBy('todo.createdAt', 'ASC');
      } 
      else 
      {
        queryBuilder.orderBy('todo.createdAt', 'DESC');
      }
    }
    queryBuilder.skip(skipAmount);
    queryBuilder.take(limit);
    const data = await queryBuilder.getMany();
    return data;
  }

  async findOne(id: number) {
    const todo = await this.todoRepository.findOne({where: {id}});
    if (todo === null) 
    {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todoToUpdate = await this.findOne(id);
    if (updateTodoDto.title) 
    {
      const existingTodo = await this.todoRepository.createQueryBuilder('todo')
        .where('LOWER(todo.title) = LOWER(:title)', { title: updateTodoDto.title }).getOne();
      if (existingTodo && existingTodo.id !== id) 
      {
        throw new BadRequestException('That title is already taken!');
      }
      todoToUpdate.title = updateTodoDto.title;
    }
    if (updateTodoDto.description !== undefined) 
    {
      todoToUpdate.description = updateTodoDto.description;
    }
    if (updateTodoDto.completed !== undefined) 
    {
      todoToUpdate.completed = updateTodoDto.completed;
    }
    return await this.todoRepository.save(todoToUpdate);
  }

  async remove(id: number) {
    const todoToDelete = await this.findOne(id);
    await this.todoRepository.remove(todoToDelete);
    return { message: 'Todo deleted successfully' };
  }


  async getStats() {
    const allTodos = await this.todoRepository.find();
    let total = allTodos.length;
    let completedTodos = allTodos.filter(function (todo) {
      return todo.completed === true;
    });
    
    let completedCount = completedTodos.length;
    let pendingCount = total - completedCount;
    let percentage = 0;

    if (total > 0) 
    {
      percentage = (completedCount / total) * 100;
    }
    
    return {
      total: total,
      completed: completedCount,
      pending: pendingCount,
      completionPercentage: percentage.toFixed(2) + '%'
    };
  }
}