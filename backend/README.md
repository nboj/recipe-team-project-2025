# Backend

## How to setup local environment for the server

### Initial setup (do this once)

1. install python
2. Create python environment

Make sure your inside the `backend/` folder before you run:

```bash
python -m venv venv
```

#### Install required packages

make sure your inside the `backend/` folder before you run:

```bash
.\venv\Scripts\activate # on windows
pip install -r requirements.txt
```

```bash
./venv/bin/activate # on linux
pip install -r requirements.txt
```

### Do this everytime before you start working

1. make sure your inside the `backend/` folder before you run:

```bash
.\venv\Scripts\activate # on windows
```

```bash
./venv/bin/activate # on linux
```

### Starting the server

```bash
fastapi dev server.py # server.py is the python file
```
