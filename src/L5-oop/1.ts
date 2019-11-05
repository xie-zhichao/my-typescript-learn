namespace L5_oop {
  interface Passgener {
    name: string;
  }

  interface Carriable {
    passengers: Passgener[];
    getUp(...passengers: Passgener[]): number;
    getOff(): number;
  }

  interface Positioned {
    x: number;
    y: number;
  }

  const positionOrigin: Positioned = { x: 0, y: 0 };

  interface Moveable {
    position: Positioned;
    moveTo(Positioned: Positioned): Positioned;
  }

  class Car implements Carriable, Moveable {
    passengers: Passgener[];
    position: Positioned;
    capacity: number;

    constructor(capacity: number) {
      this.passengers = [];
      this.position = positionOrigin;
      this.capacity = capacity;
    }

    getUp(...passengers: Passgener[]): number {
      if (passengers.length > this.capacity) {
        throw new Error(`This car can carry ${this.capacity} passengers!`);
      }
      console.log(
        `This car carries ${passengers.map(item => item.name).join(',')}`
      );
      return this.passengers.push(...passengers);
    }

    getOff(): number {
      return this.passengers.splice(0).length;
    }

    moveTo(position: Positioned): Positioned {
      Object.assign(this.position, position);
      console.log(
        `This car carries ${this.passengers.map(item => item.name).join(',')} to [${
        this.position.x
        }, ${this.position.y}]`
      );
      return this.position;
    }
  }

  // 巴士
  class Bus implements Carriable, Moveable {
    passengers: Passgener[];
    position: Positioned;
    capacity: number;

    constructor(capacity: number) {
      this.passengers = [];
      this.position = positionOrigin;
      this.capacity = capacity;
    }

    getUp(...passengers: Passgener[]): number {
      if (passengers.length > this.capacity) {
        throw new Error(`This Bus can carry ${this.capacity} passengers!`);
      }
      console.log(
        `The Bike carries ${passengers.map(item => item.name).join(',')}`
      );
      return this.passengers.push(...passengers);
    }

    getOff(): number {
      return this.passengers.splice(0).length;
    }

    moveTo(position: Positioned): Positioned {
      Object.assign(this.position, position);
      console.log(
        `The Bike carries ${this.passengers.map(item => item.name).join(',')} to [${
        this.position.x
        }, ${this.position.y}]`
      );
      return this.position;
    }
  }

  abstract class Vehicle implements Carriable, Moveable {
    name: string;
    passengers: Passgener[];
    position: Positioned;
    capacity: number;

    abstract run(speed: number): void;

    getUp(...passengers: Passgener[]): number {
      if (passengers.length > this.capacity) {
        throw new Error(`This ${this.name} can carry ${this.capacity} passengers!`);
      }
      console.log(
        `This ${this.name} carries ${passengers.map(item => item.name).join(',')}`
      );
      return this.passengers.push(...passengers);
    }

    getOff(): number {
      return this.passengers.splice(0).length;
    }

    moveTo(position: Positioned): Positioned {
      Object.assign(this.position, position);
      console.log(
        `This ${this.name} carries ${this.passengers.map(item => item.name).join(',')} to [${
        this.position.x
        }, ${this.position.y}]`
      );
      return this.position;
    }
  }

  class Ship extends Vehicle {
    constructor(capacity: number) {
      super();
      this.passengers = [];
      this.position = positionOrigin;
      this.capacity = capacity;
    }

    run(speed: number) {
      // todo, run as a ship...
      console.log(`This ${this.name} running at ${speed}km/h.`);
    }
  }


  class TravelAgency {
    name: string;

    constructor(name: string) {
      this.name = name;
    }

    carrying(carrier: Carriable & Moveable, position: Positioned, ...passengers: Passgener[]): Positioned {
      carrier.getUp(...passengers);
      return carrier.moveTo(position);
    }

  }

  let t1 = new TravelAgency("t1");
  let c1 = new Car(4);
  let b1 = new Bus(30);
  let s1 = new Ship(100);

  t1.carrying(c1, { x: 10, y: 60 }, { name: 'Jack' }, { name: 'Tom' });
  t1.carrying(b1, { x: 10, y: 60 }, { name: 'Jack' }, { name: 'Tom' }, { name: 'Mary' }, { name: 'Joe' });
  t1.carrying(s1, { x: 10, y: 60 }, { name: 'Jack' }, { name: 'Tom' }, { name: 'Mary' }, { name: 'Joe' });
}
