import asyncio
from websockets import serve

async def echo(websocket):
	async for message in websocket:
		print('[Message] ' + message)
		if message == "1":
			await websocket.send("2")
		else:
			await websocket.send(message)

async def main():
	async with serve(echo, "0.0.0.0", 8765):
		await asyncio.Future()  # run forever

asyncio.run(main())