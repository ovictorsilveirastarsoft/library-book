import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./kafka/consumer.service";

@Injectable()
export class UsersConsumer implements OnModuleInit{
    constructor(private readonly consumerService: ConsumerService){}
        
        async onModuleInit() {
            await this.consumerService.consumer(
                { topic: 'users' },
                {
                    eachMessage: async ({ topic, partition, message }) => {
                        console.log( "ESTOU AQUIIIIII",{
                           
                          value: message.value.toString(),
                          topic:topic.toString(),
                          partition:partition.toString()
                        });
                      },
                });
        }
    
}