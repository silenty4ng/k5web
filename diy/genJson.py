import os
import json

list = []
for filename in os.listdir(r'.'):
    if filename[-1] == 'n':
        list.append(filename)

print(json.dumps(list))
with open("version.json","w") as file:
    file.write(json.dumps(list))