
import csv
import json



# CREATE A LIST OF ALL COUNTRIES ------------------------------------------------------------------
countries = []
years	  = []

with open('sankeyDataIn.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	#skip the first line
	frstL = next(reader)

	# Go through each row of the csv file
	for row in reader:
		''' 	  row[0] = Year
						row[1] = Country territory of asylum residence
						row[2] = Origin
						row[3] = Population type
						row[4] = Value'''

		if (row[1] not in countries ):
			countries.append( row[1] )		

		if ( row[0] not in years ):
			years.append( row[0] )

	countries.append("VariousUnkown")
	
# ---------------------------------------------------------------------------------------------




# CREATING THE DATA FOR BARCHART IN
# ---------------------------------------------------------------------------------------------
with open('sankeyDataOut.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('barChartDataOut.csv', 'w') as td:
		# Where we are going to write
		writer = csv.writer(td)

		# Transforming the data to a list
		data = list(reader)	

		# Write the First Row: year, Country of Residence, Country of Origin,...
		firstRow = ["Year", "Residence", "Value"]
		writer.writerow(firstRow)



		#				 Country Name 
		currentCountry = data[1][2]
		#				 Value of refugees
		totalValue 	   = int(data[1][3])
		#				 Year
		currentYear    = data[1][0]


		#print str(currentCountry) + "	" + str(data[1][3])
	

		#
		for r in data[2:]:
			# If we are dealing with a new country
			if( currentCountry != r[2] or currentYear != r[0]):
				writer.writerow( [ currentYear, currentCountry, totalValue ] )	
				
				# update the country/year/totalValue
				currentCountry  = r[2]
				currentYear		= r[0]
				totalValue 		= int(r[3])
		
			# If we are dealing with the same country
			else:
				totalValue += int(r[3])

		writer.writerow( [ currentYear, currentCountry, totalValue ] )	
		
			
# ---------------------------------------------------------------------------------------------




"""
# REMOVING ALL ROWS THAT HAVE THE SAME COUNTRY IN THE "from/to" COLUMN ----------------------
with open('sankeyDataIn.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('sankeyDataOut.csv', 'w') as td:
		# Where we are going to write
		writer = csv.writer(td)

		# Write the First Row: year, Country of Origin, Value ...
		firstRow = ["Year", "Country of Origin", "Country of Residence", "Value"]
		writer.writerow(firstRow)

		#skip the first line
		frstL = next(reader)


		
		for country in countries:
			for year in years:

				# Go through each row of the csv file
				for row in reader:
					''' row[0] = Year
						row[1] = Country territory of asylum residence
						row[2] = Origin
						row[3] = Value'''

					if( str(row[0]) == str(year) ):
						print year
		

	

					
					#if( row[0] == year ):
					#	print row[0]					

					#if ( row[2] == country and row[0] == year ):
					#	writer.writerow( [ row[0], row[2], row[1], row[3] ])	
"""					
# -------------------------------------------------------------------------------------------







