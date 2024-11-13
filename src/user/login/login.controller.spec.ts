import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { UserService } from '../user.service';
import { ProducerService } from 'src/kafka/producer.service';
import { SignInUseCase } from 'src/auth/useCases/sing-in.usecase';

describe('LoginController', () => {
  let controller: LoginController;
  let userService: UserService;
  let producerService: ProducerService;
  let signInUseCase: SignInUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            deleteUser: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ProducerService,
          useValue: {
            produce: jest.fn(),
          },
        },
        {
          provide: SignInUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    userService = module.get<UserService>(UserService);
    producerService = module.get<ProducerService>(ProducerService);
    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
    expect(producerService).toBeDefined();
    expect(signInUseCase).toBeDefined();
  });
});
