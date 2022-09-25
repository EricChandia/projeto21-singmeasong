import * as testsService from '../services/testsService.js';
import { Response, Request } from 'express';



export async function reset(req: Request, res: Response) {
  
    await testsService.reset();
  
    res.status(200).send("truncate realizado");
  }