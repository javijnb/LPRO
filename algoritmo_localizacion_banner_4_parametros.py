# -*- coding: utf-8 -*-
"""
Created on Wed Apr 28 09:14:12 2021

@author: Lucia
"""
# Importamos librerias
import json
import numpy as np
import sys



# =============================================================================
# Argumentos que se le pasan al script
# RSSI1, RSSI2, RSSI3, RSSI4, fichero_malla.json, latgw1, longw1, latgw2, longw2, latgw3, longw3, latgw4, longw4
# =============================================================================


# (1) Leo los datos de la malla
with open(sys.argv[5]) as f:
    data = json.load(f)

n_gateways = 4
malla = np.zeros((len(data),n_gateways))
nodos_malla = np.zeros((len(data),2))

for i in range(len(data)):
    
    # Malla de potencias
    for j in range(n_gateways):
        malla[i][j] = data[i]["RSSI" + str(j+1)]
        
    # Localizaciones de los nodos de la malla
    nodos_malla[i][0]=data[i]["latitud"]    
    nodos_malla[i][1]=data[i]["longitud"]

# (2) Leo los datos de las BST    

# Localizaciones de los gateways
BST = np.matrix([[sys.argv[6] , sys.argv[7]],
[sys.argv[8] , sys.argv[9]],
[sys.argv[10] , sys.argv[11]],
[sys.argv[12] , sys.argv[13]]])



# (3) Leemos los RSSI
RSSI = np.matrix([[float(sys.argv[1]) , float(sys.argv[2]) , float(sys.argv[3]) , float(sys.argv[4])]])


# (4) Convierto la potencia a unidades naturales (mW)
malla_mW = np.power(10,malla/10)
RSSI_mW = np.power(10,RSSI/10)

# (5) Calculo los coeficientes de ponderacion
x = np.matmul(RSSI_mW,np.linalg.pinv(malla_mW))


# (6) Calculo el promediado
sum_x = np.sum(x,axis=1)
x = np.divide(x,sum_x) #"Normalizamos" ponderaciones

   
# (7) Calculo la posición estimada
posicion_estimada = np.matmul(x,nodos_malla)
print("[",posicion_estimada[0,0],",",posicion_estimada[0,1],"]")
