import collections
import csv, json
from collections import namedtuple



strings = []    # IDX -> STRING
source_map = {} # SSID -> IID -> [LINE_START, COL_START, LINE_END, COL_END]

def main(trace_csv_file = "trace.log", strings_json_file = "strings.json", source_map_json_file = "smap.json") :
	global strings, source_map
	with open(source_map_json_file) as source_map_json:
		source_map = json.load(source_map_json)

	with open(strings_json_file) as strings_json:
		strings = json.load(strings_json)

	with open(trace_csv_file) as trace_csv:
		trace_reader = csv.reader(trace_csv)
		for row in trace_reader:
			handle_row(row)

Mem = namedtuple('Mem', ['oid', 'offset'])
Loc = namedtuple('Loc', ['sid', 'iid'])
Val = namedtuple('Val', ['type', 'value'])

def string(idx):
	return strings[int(idx)-1]

def make_loc(sid, iid):
	return Loc(sid, iid)

def make_val(type, value):
	return Val(type, value)

def make_mem(ofid, offset):
	return None if ofid == "0" else Mem(ofid, offset)

def str_loc(loc):
	(sid, iid) = loc
	if len(source_map) == 1:
		return "Line " + str(source_map[sid][iid][0]) if iid in source_map[sid] else "IID " + iid
	else:
		return source_map[sid][originalSourceFile] + ":" + str(source_map[sid][iid][0])

def str_mem(mem) :
	if mem == None :
		return "undefined"
	else :
		(oid, offset) = mem
		return oid + "." + string(offset)

def str_val(val) :
	(type, value) = val
	return type + ":" + value

def handle_row(row) :
	if row[0] == "R" :
		handle_read(sid=row[1], iid=row[2], fid=row[3], offset=row[4], value=row[5], type=row[6])
	elif row[0] == "W" :
		handle_write(sid=row[1], iid=row[2], fid=row[3], offset=row[4], value=row[5], type=row[6])
	elif row[0] == "G":
		handle_getfield(sid=row[1], iid=row[2], rid=row[3], oid=row[4], offset=row[5], value=row[6], type=row[7])
	elif row[0] == "P":
		handle_putfield(sid=row[1], iid=row[2], rid=row[3], oid=row[4], offset=row[5], value=row[6], type=row[7])
	elif row[0] == "C":
		handle_call(sid=row[1], iid=row[2], oid=row[3], fid=row[4])
	elif row[0] == "E":
		handle_return(sid=row[1], iid=row[2], value=row[3], type=row[4])


def handle_read(sid, iid, fid, offset, type, value):
	loc = make_loc(sid, iid)
	mem = make_mem(fid, offset)
	val = make_val(type, value)
	read_mem(mem, loc, val)
	pass

def handle_write(sid, iid, fid, offset, type, value):
	loc = make_loc(sid, iid)
	mem = make_mem(fid, offset)
	val = make_val(type, value)
	write_mem(mem, loc, val)
	pass

def handle_getfield(sid, iid, rid, oid, offset, type, value):
	loc = make_loc(sid, iid)
	mem = make_mem(oid, offset)
	val = make_val(type, value)
	read_mem(mem, loc, val)
	pass

def handle_putfield(sid, iid, rid, oid, offset, type, value):
	loc = make_loc(sid, iid)
	mem = make_mem(oid, offset)
	val = make_val(type, value)
	write_mem(mem, loc, val)
	pass

def handle_call(sid, iid, oid, fid):
	loc = make_loc(sid, iid)
	push_sets()
	pass

def handle_return(sid, iid, type, value):
	loc = make_loc(sid, iid)
	val = make_val(type, value)
	pop_sets()
	pass

read_sets_stack = []    # MEM -> [LOC X VAL]  // List of reads-before-writes to a memory address
write_sets_stack = []   # MEM -> LOC X VAL    // The last write to a memory address

def read_set() :
	return read_sets_stack[-1]

def write_set():
	return write_sets_stack[-1]

def push_sets():
	read_sets_stack.append({})
	write_sets_stack.append({})

def pop_sets():
	callee_read_set = read_sets_stack.pop()
	caller_read_set = read_sets_stack[-1]
	callee_write_set = write_sets_stack.pop()
	caller_write_set = write_sets_stack[-1]

	# print callee_read_set, caller_write_set

	# Collect all callee's reads into caller's reads, if not written in caller
	for mem in callee_read_set:
		if not mem in caller_write_set:
			if not mem in caller_read_set:
				caller_read_set[mem] = []
			caller_read_set[mem].extend(callee_read_set[mem])

	# Overwrite all of callee's last-writes into caller's last-writes
	for mem in callee_write_set:
		caller_write_set[mem] = callee_write_set[mem]

def read_mem(mem, loc, val) :
	rs = read_set()
	ws = write_set()
	if not mem in ws :
		if not mem in rs :
			rs[mem] = []
		rs[mem].append((loc, val))

def write_mem(mem, loc, val) :
	ws = write_set()
	ws[mem] = (loc, val)


def print_read_set(rs, tabs=0) :
	for mem in rs:
		print "  "*tabs + "Reads of " + str_mem(mem)
		tabs += 1
		for (loc, val) in rs[mem]:
			print "  "*tabs + str_loc(loc) + " = " + str_val(val)
		tabs -= 1



def print_write_set(ws, tabs=0) :
	for mem in ws:
		print "  "*tabs + "Last Write of " + str_mem(mem)
		tabs += 1
		(loc, val)  = ws[mem]
		print "  "*tabs + str_loc(loc) + " = " + str_val(val)
		tabs -= 1

push_sets()
main()
print_read_set(read_set())
print_write_set(write_set())